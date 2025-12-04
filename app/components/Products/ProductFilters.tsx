'use client';

import { useState } from 'react';
import { Search, Filter, X, Sliders } from 'lucide-react';

interface ProductFiltersProps {
  filters: {
    search: string;
    category: string;
    in_stock: boolean;
    low_stock: boolean;
    sort_by: string;
    sort_order: 'asc' | 'desc';
  };
  onFilterChange: (filters: any) => void;
  categories?: string[];
}

export default function ProductFilters({ filters, onFilterChange, categories = [] }: ProductFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handleStockFilter = (filterType: 'in_stock' | 'low_stock') => {
    onFilterChange({ ...filters, [filterType]: !filters[filterType] });
  };

  const handleSortChange = (sort_by: string) => {
    onFilterChange({ ...filters, sort_by });
  };

  const handleOrderChange = () => {
    onFilterChange({ ...filters, sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc' });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      in_stock: false,
      low_stock: false,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      {/* Main Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products by name or barcode..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
            />
            {filters.search && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleStockFilter('in_stock')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.in_stock
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => handleStockFilter('low_stock')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.low_stock
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
          >
            <Sliders className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filters.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
                >
                  <option value="name">Name</option>
                  <option value="created_at">Date Added</option>
                  <option value="total_stock">Stock Quantity</option>
                  <option value="sale_price">Price</option>
                </select>
                <button
                  onClick={handleOrderChange}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  title={filters.sort_order === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {filters.sort_order === 'asc' ? 'A-Z' : 'Z-A'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end">
              <div className="flex space-x-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowAdvanced(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {filters.search}
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Category: {filters.category}
                <button
                  onClick={() => handleCategoryChange('')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.in_stock && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
                <button
                  onClick={() => handleStockFilter('in_stock')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.low_stock && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Low Stock
                <button
                  onClick={() => handleStockFilter('low_stock')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}