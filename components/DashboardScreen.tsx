import React, { useState, useEffect } from 'react';
import type { Product, Transaction } from '../types';
import { AlertTriangleIcon, PackageIcon } from './Icons';

// --- StatCard for Dashboard ---
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);


// --- DashboardScreen Component (Default Export) ---
interface DashboardScreenProps {
  products: Product[];
  transactions: Transaction[];
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ products, transactions }) => {
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.quantity <= p.lowStockThreshold).length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalSales = transactions.length;

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`Rs ${totalRevenue.toFixed(2)}`} 
                    icon={<PackageIcon className="w-6 h-6 text-white"/>} 
                    color="bg-green-500" 
                />
                <StatCard 
                    title="Total Sales" 
                    value={totalSales} 
                    icon={<PackageIcon className="w-6 h-6 text-white"/>} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Total Products" 
                    value={totalProducts} 
                    icon={<PackageIcon className="w-6 h-6 text-white"/>} 
                    color="bg-purple-500" 
                />
                <StatCard 
                    title="Low Stock Items" 
                    value={lowStockItems} 
                    icon={<AlertTriangleIcon className="w-6 h-6 text-white"/>} 
                    color={lowStockItems > 0 ? "bg-red-500" : "bg-yellow-500"}
                />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentTransactions.length > 0 ? recentTransactions.map(t => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">#{String(t.id).slice(-6)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{new Date(t.timestamp).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{t.items.reduce((sum, item) => sum + item.quantitySold, 0)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-semibold">Rs {t.total.toFixed(2)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">No transactions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// --- Animated Bar for SimpleBarChart ---
const Bar: React.FC<{ value: number; maxValue: number; barColor: string; label: string; delay: number }> = ({ value, maxValue, barColor, label, delay }) => {
    const [height, setHeight] = useState('0%');

    useEffect(() => {
        // Use a timeout to trigger the animation after the component mounts
        const timer = setTimeout(() => {
            setHeight(`${maxValue > 0 ? (value / maxValue) * 100 : 0}%`);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, maxValue, delay]);

    return (
        <div className="flex flex-col items-center flex-1 h-full pt-4">
            <div className="flex-grow flex items-end w-full">
                <div 
                    className={`w-full ${barColor} rounded-t-md transition-all duration-700 ease-out`}
                    style={{ height: height }}
                    title={`${label}: ${value.toFixed(2)}`}
                ></div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate w-full text-center">{label}</span>
        </div>
    );
};

// --- SimpleBarChart for Analytics ---
const SimpleBarChart: React.FC<{ data: { label: string; value: number }[]; title: string; barColor: string }> = ({ data, title, barColor }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            {data.length > 0 ? (
                <div className="flex justify-around items-end h-64 space-x-2">
                    {data.map(({ label, value }, index) => (
                        <Bar
                            key={label}
                            value={value}
                            maxValue={maxValue}
                            barColor={barColor}
                            label={label}
                            delay={index * 100} // Stagger the animation
                        />
                    ))}
                </div>
            ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">Not enough data to display.</div>
            )}
        </div>
    );
};


// --- AnalyticsScreen Component (Named Export) ---
interface AnalyticsScreenProps {
  transactions: Transaction[];
  products: Product[];
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ transactions, products }) => {
    // Sales over time (last 7 days)
    const salesByDay: { [key: string]: number } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayLabel = date.toLocaleDateString(undefined, { weekday: 'short' });
        days.push(dayLabel);
        salesByDay[dayLabel] = 0;
    }

    transactions.forEach(t => {
        const transactionDate = new Date(t.timestamp);
        if ((today.getTime() - transactionDate.getTime()) < 7 * 24 * 3600 * 1000) {
            const day = transactionDate.toLocaleDateString(undefined, { weekday: 'short' });
            salesByDay[day] = (salesByDay[day] || 0) + t.total;
        }
    });
    
    const weeklySalesData = days.map(day => ({ label: day, value: salesByDay[day] }));

    // Top selling products by quantity
    const salesByProduct: { [sku: string]: { name: string; quantity: number; revenue: number } } = {};
    transactions.forEach(t => {
        t.items.forEach(item => {
            if (!salesByProduct[item.productSku]) {
                const product = products.find(p => p.sku === item.productSku);
                salesByProduct[item.productSku] = { name: product?.name || item.productSku, quantity: 0, revenue: 0 };
            }
            salesByProduct[item.productSku].quantity += item.quantitySold;
            salesByProduct[item.productSku].revenue += item.quantitySold * item.pricePerItem;
        });
    });

    const topProductsByQuantity = Object.values(salesByProduct)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(data => ({
            label: data.name,
            value: data.quantity
        }));
        
    const topProductsByRevenue = Object.values(salesByProduct)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(data => ({
            label: data.name,
            value: data.revenue
        }));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <SimpleBarChart data={topProductsByQuantity} title="Top 5 Products by Quantity Sold" barColor="bg-blue-500" />
                 <SimpleBarChart data={topProductsByRevenue} title="Top 5 Products by Revenue (Rs)" barColor="bg-green-500" />
            </div>
            <SimpleBarChart data={weeklySalesData} title="Sales This Week (Rs)" barColor="bg-purple-500" />
        </div>
    );
};

export default DashboardScreen;