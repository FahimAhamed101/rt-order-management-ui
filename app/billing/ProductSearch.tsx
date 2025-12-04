
'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useLazySearchProductsForSaleQuery } from '@/app/store/api/productApi';

interface ProductSearchProps {
  products: any[];
  onAddProduct: (product: any) => void;
}

export default function ProductSearch({ onAddProduct }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerSearch, { data, isLoading }] = useLazySearchProductsForSaleQuery();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      triggerSearch({ search: searchTerm });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by name or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border rounded-l-md px-3 py-2"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Search size={20} />
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isLoading && <div className="text-center py-4">Searching...</div>}
        {data?.data?.data?.map((product: any) => (
          <div
            key={product.id}
            className="border rounded-md p-3 hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <h4 className="font-medium">{product.name}</h4>
              <div className="text-sm text-gray-600">
                <span>Barcode: {product.barcode}</span>
                <span className="mx-2">|</span>
                <span>Stock: {product.total_quantity}</span>
                <span className="mx-2">|</span>
                <span>Price: ${product.fifo_stock?.sale_price}</span>
              </div>
            </div>
            <button
              onClick={() => onAddProduct(product)}
              disabled={!product.fifo_stock || product.fifo_stock.quantity === 0}
              className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!product.fifo_stock ? 'Out of stock' : 'Add to order'}
            >
              <Plus size={20} />
            </button>
          </div>
        ))}
        {!isLoading && data?.data?.data?.length === 0 && (
          <div className="text-center py-4 text-gray-500">No products found</div>
        )}
      </div>
    </div>
  );
}