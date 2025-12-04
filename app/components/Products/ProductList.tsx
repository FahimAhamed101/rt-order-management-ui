'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  ShoppingCart,
  MoreVertical,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useDeleteProductMutation } from '@/app/store/api/productApi';

interface Product {
  id: number;
  name: string;
  barcode: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
  stocks?: Array<{
    quantity: number;
    sale_price: number;
    purchase_price: number;
  }>;
}

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onView?: (product: Product) => void;
}

export default function ProductList({ 
  products, 
  loading = false,
  onEdit,
  onDelete,
  onView 
}: ProductListProps) {
  const [deleteProduct] = useDeleteProductMutation();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        onDelete?.(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const calculateTotalStock = (product: Product) => {
    return product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;
  };

  const calculateAveragePrice = (product: Product) => {
    if (!product.stocks?.length) return 0;
    const total = product.stocks.reduce((sum, stock) => sum + stock.sale_price, 0);
    return total / product.stocks.length;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (quantity <= 10) return { text: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
          <Package className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-6">Get started by adding your first product.</p>
        <Link
          href="/products/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Package className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const totalStock = calculateTotalStock(product);
        const avgPrice = calculateAveragePrice(product);
        const stockStatus = getStockStatus(totalStock);

        return (
          <div key={product.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center">
                        {product.stocks && product.stocks.length > 0 && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                            {product.stocks.length} SKUs
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>Barcode: <code className="font-mono">{product.barcode}</code></span>
                      <span>•</span>
                      <span className={stockStatus.color}>{stockStatus.text}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ${avgPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {totalStock} in stock
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView?.(product)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit?.(product)}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setExpandedRow(expandedRow === product.id ? null : product.id)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {expandedRow === product.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">
                        {product.description || 'No description available'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Stock Details</h4>
                      <div className="space-y-1">
                        {product.stocks?.map((stock, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">SKU {index + 1}:</span>
                            <span className="font-medium">{stock.quantity} units</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
                      <div className="flex space-x-2">
                        <Link
                          href={`/products/${product.id}/stock`}
                          className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                        >
                          Manage Stock
                        </Link>
                        <Link
                          href={`/billing?product=${product.id}`}
                          className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                        >
                          <ShoppingCart className="inline h-3 w-3 mr-1" />
                          Sell
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Package className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-gray-600">
                      Created {format(new Date(product.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {product.updated_at !== product.created_at && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">
                        Updated {format(new Date(product.updated_at), 'MMM d, yyyy')}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}