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
        <span className="font-mono font-medium">{value}</span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer_name',
    },
    {
      header: 'Date',
      accessor: 'date_time',
      cell: (value: string) => format(new Date(value), 'dd MMM yyyy HH:mm'),
    },
    {
      header: 'Total',
      accessor: 'total_amount',
      cell: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value]}`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'payment_status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'paid' ? 'bg-green-100 text-green-800' : 
          value === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (id: number, row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/orders/${id}`)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View"
          >
            <Eye size={18} />
          </button>
          {row.status === 'Pending' && (
            <>
              <button
                onClick={() => router.push(`/orders/${id}/edit`)}
                className="p-1 text-green-600 hover:text-green-800"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="p-1 text-red-600 hover:text-red-800"
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <button
            onClick={() => router.push('/billing')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create New Order
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center mb-4">
            <Filter size={20} className="mr-2" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={filters.customer_name}
              onChange={(e) => handleFilterChange('customer_name', e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="Invoice Number"
              value={filters.invoice_number}
              onChange={(e) => handleFilterChange('invoice_number', e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="border rounded-md px-3 py-2 flex-1"
              />
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="border rounded-md px-3 py-2 flex-1"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <DataTable
              columns={columns}
              data={ordersData?.data?.data || []}
              pagination={{
                currentPage: ordersData?.data?.current_page || 1,
                lastPage: ordersData?.data?.last_page || 1,
                perPage: filters.per_page,
                total: ordersData?.data?.total || 0,
                onPageChange: (page) => setFilters(prev => ({ ...prev, page })),
                onPerPageChange: (per_page) => setFilters(prev => ({ ...prev, per_page, page: 1 })),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}