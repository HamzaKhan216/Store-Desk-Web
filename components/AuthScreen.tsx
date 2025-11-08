import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { PackageIcon, ChartBarIcon, ShoppingCartIcon } from './Icons';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title:string, description:string }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mb-3">
            {icon}
        </div>
        <h3 className="font-semibold text-lg mb-1 text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
);


const AuthScreen: React.FC = () => {
  const [authMode, setAuthMode] = useState<'welcome' | 'signin' | 'signup'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
        setAuthMode('signin');
      } else { // signin
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAuthForm = () => {
    const isSignUp = authMode === 'signup';
    return (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
          <form onSubmit={handleAuth} className="space-y-8">
            <div className="relative z-0">
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="peer block w-full px-3 py-2.5 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder=" " 
                />
                <label
                    htmlFor="email"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                >
                    Email address
                </label>
            </div>
             <div className="relative z-0">
                <input
                  id="password" name="password" type="password" autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="peer block w-full px-3 py-2.5 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder=" "
                />
                 <label
                    htmlFor="password"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                >
                    Password
                </label>
            </div>

            {error && <p className="text-red-500 text-sm text-center !mt-4">{error}</p>}
            
            <div className="!mt-8">
              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthMode(isSignUp ? 'signin' : 'signup');
                setError(null);
              }}
              className="text-sm text-blue-500 hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
            {authMode !== 'welcome' && (
               <button onClick={() => setAuthMode('welcome')} className="text-sm text-gray-500 hover:underline ml-4">
                 Back
               </button>
            )}
          </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4 text-gray-800 dark:text-gray-200">
      <div className="max-w-xl w-full mx-auto text-center">
        {authMode === 'welcome' ? (
          <div className="animate-fade-in">
            <div className="flex justify-center mb-4">
                <img src="data:image/png;base64,[YOUR_BASE64_STRING_HERE]" alt="Stock Desk Logo" className="h-16 w-16" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3">
                Welcome to Stock Desk
            </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">
                Modern Inventory Management, Simplified.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10 text-left">
                  <FeatureCard 
                      icon={<PackageIcon className="w-7 h-7 text-blue-500" />} 
                      title="Track Inventory" 
                      description="Effortlessly manage products, stock levels, and pricing." 
                  />
                  <FeatureCard 
                      icon={<ShoppingCartIcon className="w-7 h-7 text-green-500" />} 
                      title="Process Sales" 
                      description="A simple point-of-sale interface for quick checkouts." 
                  />
                  <FeatureCard 
                      icon={<ChartBarIcon className="w-7 h-7 text-purple-500" />} 
                      title="Gain Insights" 
                      description="Analyze sales data to make smarter business decisions." 
                  />
              </div>

              <div className="space-y-4 max-w-sm mx-auto">
                  <button onClick={() => setAuthMode('signup')} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Get Started Free
                  </button>
                  <button onClick={() => setAuthMode('signin')} className="w-full bg-transparent text-blue-600 dark:text-blue-400 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      Sign In
                  </button>
              </div>
          </div>
        ) : (
          <div className="max-w-md w-full">
            {renderAuthForm()}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;