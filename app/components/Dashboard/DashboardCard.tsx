'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string; // e.g., "+12%" or "-5%"
  trend?: 'up' | 'down';
  description?: string;
  href?: string;
  loading?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  indigo: {
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
};

export default function DashboardCard({
  title,
  value,
  icon,
  change,
  trend = 'up',
  description,
  href,
  loading = false,
  color = 'blue',
}: DashboardCardProps) {
  const colors = colorClasses[color];
  const isPositive = !change || change.startsWith('+') || trend === 'up';
  
  const content = (
    <div className={`
      ${colors.bg} ${colors.border}
      border rounded-xl p-6 hover:shadow-lg transition-all duration-300
      ${href ? 'cursor-pointer hover:scale-[1.02]' : ''}
      h-full
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${colors.iconBg} rounded-xl`}>
          <div className={colors.iconColor}>{icon}</div>
        </div>
        
        {change && (
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-semibold">{change}</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-semibold">{change}</span>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {loading ? (
          <>
            <div className="h-7 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
          </>
        )}
      </div>
      
      {description && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      )}
      
      {href && (
        <div className="mt-4 flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <span>View details</span>
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}