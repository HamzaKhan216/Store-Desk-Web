import React, { useState, useRef, useEffect } from 'react';
import { getAiInsight } from '../services/geminiService';
import type { Product, Transaction } from '../types';
import { BotIcon, XIcon } from './Icons';

interface AiAssistantProps {
  products: Product[];
  transactions: Transaction[];
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ products, transactions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setMessages([{ sender: 'ai', text: "Hello! I'm your AI Assistant. Ask me 'What should I restock?' or 'What's selling well?' to get started." }]);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAiInsight(input, products, transactions);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110 z-40"
        aria-label="Toggle AI Assistant"
      >
        <BotIcon className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-full max-h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 transition-all duration-300 ease-out origin-bottom-right data-[state=closed]:scale-0 data-[state=closed]:opacity-0" data-state={isOpen ? 'open' : 'closed'}>
          <div className="flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg">
            <h3 className="font-bold text-lg">AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-600 p-1 rounded-full">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-4 py-2 max-w-[85%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2">
                      <span className="animate-pulse">...</span>
                    </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 p-2 border rounded-l-md focus:ring-blue-500 focus:border-blue-500 bg-transparent dark:border-gray-600"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
