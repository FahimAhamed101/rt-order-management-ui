'use client';

import { useState } from 'react';
import { useGetOrdersQuery, useDeleteOrderMutation } from '@/app/store/api/orderApi';
import { useRouter } from 'next/navigation';
import DataTable from '@/app/components/UI/DataTable';
import { format } from 'date-fns';
import { Eye, Edit, Trash2, Filter } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    customer_name: '',
    invoice_number: '',
    status: '',
    start_date: '',
    end_date: '',
    page: 1,
    per_page: 10,
  });

  const { data: ordersData, isLoading, refetch } = useGetOrdersQuery(filters);
  const [deleteOrder] = useDeleteOrderMutation();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const columns = [
    {
      header: 'Invoice',
      accessor: 'invoice_number',
      cell: (value: string) => (
        <span className="font-mono font-medium">{value || '-'}</span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer_name',
      cell: (value: string) => value || '-',
    },
    {
      header: 'Date',
      accessor: 'date_time',
      cell: (value: string) => {
        try {
          return value ? format(new Date(value), 'dd MMM yyyy HH:mm') : '-';
        } catch (error) {
          return '-';
        }
      },
    },
    {
      header: 'Total',
      accessor: 'total_amount',
      cell: (value: any) => {
        // Handle different value types safely
        const numValue = Number(value);
        return !isNaN(numValue) ? `$${numValue.toFixed(2)}` : '$0.00';
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[value] || 'bg-gray-100 text-gray-800'
        }`}>
          {value || 'Unknown'}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'payment_status',
      cell: (value: string) => {
        const paymentValue = value || 'unpaid';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            paymentValue === 'paid' ? 'bg-green-100 text-green-800' : 
            paymentValue === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {paymentValue.charAt(0).toUpperCase() + paymentValue.slice(1)}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (id: number, row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/orders/${id}`)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye size={18} />
          </button>
          {(row.status === 'Pending' || !row.status) && (
            <>
              <button
                onClick={() => router.push(`/orders/${id}/edit`)}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      customer_name: '',
      invoice_number: '',
      status: '',
      start_date: '',
      end_date: '',
      page: 1,
      per_page: 10,
    });
  };

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  // Safely get orders data
  const orders = ordersData?.data?.data || [];
  const paginationData = ordersData?.data || {};
  const totalItems = paginationData.total || 0;
  const currentPage = paginationData.current_page || 1;
  const lastPage = paginationData.last_page || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track customer orders</p>
          </div>
          <button
            onClick={() => router.push('/billing')}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors w-full sm:w-auto"
          >
            Create New Order
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex items-center">
              <Filter size={20} className="mr-2 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Search by name"
                value={filters.customer_name}
                onChange={(e) => handleFilterChange('customer_name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Invoice Number
              </label>
              <input
                type="text"
                placeholder="Search invoice"
                value={filters.invoice_number}
                onChange={(e) => handleFilterChange('invoice_number', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Date Range */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date Range
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    max={filters.end_date || today}
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                    min={filters.start_date}
                    max={today}
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{orders.length}</span> of{' '}
                <span className="font-medium">{totalItems}</span> orders
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-700">Loading orders...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Filter size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500 mb-6">
                    {Object.values(filters).some(v => v !== '' && v !== 1 && v !== 10) 
                      ? 'Try adjusting your filters' 
                      : 'Get started by creating your first order'}
                  </p>
                  <button
                    onClick={() => router.push('/billing')}
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Create New Order
                  </button>
                </div>
              ) : (
                /* Data Table */
                <DataTable
                  columns={columns}
                  data={orders}
                  pagination={{
                    currentPage,
                    lastPage,
                    perPage: filters.per_page,
                    total: totalItems,
                    onPageChange: (page) => setFilters(prev => ({ ...prev, page })),
                    onPerPageChange: (per_page) => setFilters(prev => ({ ...prev, per_page, page: 1 })),
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}