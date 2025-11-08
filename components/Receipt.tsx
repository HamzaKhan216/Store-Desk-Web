import React from 'react';
import type { Transaction } from '../types';

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ transaction, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="receipt-modal">
        <div className="text-center mb-4">
            <h2 className="text-xl font-bold">Stock Desk</h2>
            <p className="text-sm text-gray-500">Transaction Receipt</p>
        </div>
        <div className="text-sm space-y-2">
            <p><strong>Transaction ID:</strong> #{String(transaction.id).slice(-6)}</p>
            <p><strong>Date:</strong> {transaction.timestamp.toLocaleString()}</p>
        </div>
        <div className="border-t border-b border-dashed my-3 py-3">
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        <th className="text-left font-semibold">Item</th>
                        <th className="text-center font-semibold">Qty</th>
                        <th className="text-right font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {transaction.items.map(item => (
                        <tr key={item.productSku}>
                            <td className="text-left">{item.name}</td>
                            <td className="text-center">{item.quantitySold}</td>
                            <td className="text-right">Rs {(item.pricePerItem * item.quantitySold).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="text-sm space-y-1">
            <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs {transaction.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Discount:</span>
                <span>{transaction.discountPercent}%</span>
            </div>
            <div className="flex justify-between font-bold text-base">
                <span>Total:</span>
                <span>Rs {transaction.total.toFixed(2)}</span>
            </div>
        </div>
        <div className="mt-6 flex space-x-2 no-print">
            <button
                onClick={onClose}
                className="w-full px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
            >
                Close
            </button>
            <button
                onClick={handlePrint}
                className="w-full px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
                Print
            </button>
        </div>
    </div>
  );
};

export default Receipt;