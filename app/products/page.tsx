'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProductsQuery, useDeleteProductMutation } from '@/app/store/api/productApi';
import { useGetStocksQuery } from '@/app/store/api/stockApi';
import ProductFilters from '@/app/components/Products/ProductFilters';
import DataTable from '@/app/components/UI/DataTable';
import { 
  Package, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  BarChart3,
  AlertCircle
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  barcode: string;
  slug: string;
  description?: string;
  total_stock?: number;
  has_stock?: boolean;
  low_stock?: boolean;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const router = useRouter();
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    in_stock: false,
    low_stock: false,
    sort_by: 'created_at',
    sort_order: 'desc' as 'asc' | 'desc',
    page: 1,
    per_page: 10,
  });

  // Fetch products with filters
  const { data: productsData, isLoading: productsLoading, refetch } = useGetProductsQuery(filters);
  
  // Fetch stock summary for additional info
  const { data: stockSummary } = useGetStocksQuery({
    product_id: undefined,
    in_stock: true,
  });

  // Delete mutation
  const [deleteProduct] = useDeleteProductMutation();

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePerPageChange = (per_page: number) => {
    setFilters(prev => ({ ...prev, per_page, page: 1 }));
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. It may have existing orders or stock.');
      }
    }
  };

  const exportProducts = () => {
    // In a real app, this would generate and download a CSV
    alert('Export feature coming soon!');
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      cell: (value: string, row: Product) => (
        <div className="flex items-center">
          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
            <Package className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.barcode}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Stock',
      accessor: 'total_stock',
      cell: (value: number, row: Product) => (
        <div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 0 
              ? 'bg-red-100 text-red-800' 
              : (row.low_stock ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')
          }`}>
            {value === 0 ? 'Out of Stock' : `${value} units`}
          </div>
          {row.low_stock && value > 0 && (
            <div className="mt-1 text-xs text-yellow-600 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Low stock
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (value: string) => (
        <div className="text-sm text-gray-600 truncate max-w-xs">
          {value || 'No description'}
        </div>
      ),
    },
    {
      header: 'Last Updated',
      accessor: 'updated_at',
      cell: (value: string) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (id: number) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/products/${id}`)}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => router.push(`/products/${id}/edit`)}
            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Books',
    'Toys',
    'Food & Beverages',
    'Health & Beauty',
    'Sports',
    'Automotive',
    'Office Supplies',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-2">
                Manage your product catalog and inventory
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={exportProducts}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => router.push('/products/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {productsData?.data?.total || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stockSummary?.data?.in_stock_items || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stockSummary?.data?.low_stock_items || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stockSummary?.data?.out_of_stock_items || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {productsLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={productsData?.data?.data || []}
                pagination={{
                  currentPage: productsData?.data?.current_page || 1,
                  lastPage: productsData?.data?.last_page || 1,
                  perPage: filters.per_page,
                  total: productsData?.data?.total || 0,
                  onPageChange: handlePageChange,
                  onPerPageChange: handlePerPageChange,
                }}
              />
              
              {(!productsData?.data?.data || productsData.data.data.length === 0) && (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <Package className="h-full w-full" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filters.search || filters.category || filters.in_stock || filters.low_stock
                      ? 'Try adjusting your filters'
                      : 'Get started by creating your first product.'}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/products/new')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bulk Actions */}
        {productsData?.data?.data && productsData.data.data.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(productsData.data.current_page - 1) * filters.per_page + 1} to{' '}
              {Math.min(productsData.data.current_page * filters.per_page, productsData.data.total)} of{' '}
              {productsData.data.total} products
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/reports/products')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </button>
              <button
                onClick={() => router.push('/stocks')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Package className="h-4 w-4 mr-2" />
                Manage Stock
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}