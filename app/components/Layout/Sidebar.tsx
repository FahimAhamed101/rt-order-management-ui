'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useSelector((state: any) => state.auth);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Billing', href: '/billing', icon: DollarSign },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:shadow-none
        `}
      >
        <div className="h-full flex flex-col">
    

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2.5 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {item.name}
                  {item.name === 'Orders' && (
                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </Link>
              );
            })}

            <p className="px-3 mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              System
            </p>
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2.5 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="border-t p-4">
        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
        <span className="text-indigo-600 font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </span>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">
          {user?.name || 'User Name'}
        </p>
        <p className="text-xs text-gray-500">
          {user?.email || 'user@example.com'}
        </p>
      </div>
          </div>
        </div>
      </div>
    </>
  );
}