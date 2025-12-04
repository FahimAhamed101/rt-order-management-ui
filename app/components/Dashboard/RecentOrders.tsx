'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  Truck,
  XCircle,
  MoreVertical
} from 'lucide-react';

interface Order {
  id: number;
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date_time: string;
}

interface RecentOrdersProps {
  orders?: Order[];
  loading?: boolean;
}

const statusConfig = {
  Pending: {
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Pending',
  },
  Processing: {
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Processing',
  },
  Delivered: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Delivered',
  },
  Cancelled: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Cancelled',
  },
};

export default function RecentOrders({ orders = [], loading = false }: RecentOrdersProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-600">Latest 5 orders from your store</p>
        </div>
        <Link
          href="/orders"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all →
        </Link>
      </div>
      
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.slice(0, 5).map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            const statusColor = statusConfig[order.status].color;
            const statusBgColor = statusConfig[order.status].bgColor;
            const statusLabel = statusConfig[order.status].label;

            return (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-3 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${statusBgColor}`}>
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                  </div>
                  <div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {order.invoice_number}
                    </Link>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(order.date_time), 'MMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBgColor} ${statusColor}`}>
                      {statusLabel}
                    </span>
                    <button className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <ShoppingCart className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first order.</p>
            <div className="mt-6">
              <Link
                href="/billing"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Create Order
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {orders.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></div>
                <span className="text-gray-600">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-100 rounded-full mr-2"></div>
                <span className="text-gray-600">Processing</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
                <span className="text-gray-600">Delivered</span>
              </div>
            </div>
            <div className="text-gray-500">
              {orders.filter(o => o.status === 'Delivered').length} of {orders.length} delivered
            </div>
          </div>
        </div>
      )}
    </div>
  );
}