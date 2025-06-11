import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LogOut, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'eSIM Code Management', href: '/esim-codes', icon: '📱' },
  { name: 'Usage', href: '/usage', icon: '📈' },
  { name: 'Team Settings', href: '/team', icon: '👥' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 h-16">
          <img src="/LogoRoam.png" alt="Roam Admin Logo" className="h-6" />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-200">
          <Link
            to="/settings"
            className={cn(
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-2',
              location.pathname === '/settings'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg transition-colors hover:bg-gray-50 hover:text-red-600"
            onClick={() => {
              // Add logout logic here
              console.log('Logout clicked');
            }}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
