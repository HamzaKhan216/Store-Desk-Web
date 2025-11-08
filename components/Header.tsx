import React from 'react';
import type { View, Theme } from '../types';
import { PackageIcon, LayoutDashboardIcon, ShoppingCartIcon, ChartBarIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  onViewChange: (view: View) => void;
  currentView: View;
  theme: Theme;
  onThemeToggle: () => void;
  onSignOut: () => void;
}

const NAV_ITEMS: View[] = ['Dashboard', 'Products', 'Billing', 'Analytics'];

// FIX: Changed React.ReactNode to React.ReactElement for better type inference with React.cloneElement.
// FIX: Further specified the props for React.ReactElement to include className. This resolves the type error with React.cloneElement.
const VIEW_ICONS: { [key in View]: React.ReactElement<{ className?: string }> } = {
    Dashboard: <LayoutDashboardIcon className="w-5 h-5 mr-2" />,
    Products: <PackageIcon className="w-5 h-5 mr-2" />,
    Billing: <ShoppingCartIcon className="w-5 h-5 mr-2" />,
    Analytics: <ChartBarIcon className="w-5 h-5 mr-2" />,
};

const Header: React.FC<HeaderProps> = ({ onViewChange, currentView, theme, onThemeToggle, onSignOut }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* The default icon has been replaced with an img tag. Change 'logo.png' to your file's name. */}
            <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">Stock Desk</h1>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:block">
              <nav className="flex items-center space-x-1">
                {NAV_ITEMS.map((view) => (
                  <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      currentView === view
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    aria-current={currentView === view ? 'page' : undefined}
                  >
                    {VIEW_ICONS[view]}
                    {view}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center ml-4 space-x-2">
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
              </button>
              <button
                onClick={onSignOut}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700">
            <nav className="flex justify-around p-2">
                {NAV_ITEMS.map((view) => (
                    <button
                        key={view}
                        onClick={() => onViewChange(view)}
                        className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium w-20 h-16 transition-colors duration-150 ${
                        currentView === view
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                         aria-current={currentView === view ? 'page' : undefined}
                    >
                        {/* FIX: Removed redundant type assertion after changing VIEW_ICONS type. */}
                        {React.cloneElement(VIEW_ICONS[view], { className: "w-6 h-6"})}
                        <span className="mt-1">{view}</span>
                    </button>
                ))}
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
