'use client';

import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Building, Search, X } from 'lucide-react';
import { useState } from 'react';

interface CustomerFormProps {
  control: Control<any>;
  errors: any;
  setValue?: UseFormSetValue<any>;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CustomerForm({ control, errors, setValue }: CustomerFormProps) {
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '01711223344', address: '123 Main St, City' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '01722334455', address: '456 Oak Ave, Town' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '01733445566', address: '789 Pine Rd, Village' },
  ]);

  const handleCustomerSelect = (customer: Customer) => {
    if (setValue) {
      setValue('customer_name', customer.name);
      setValue('customer_email', customer.email);
      setValue('customer_phone', customer.phone);
      setValue('customer_address', customer.address);
    }
    setShowCustomerSearch(false);
    setSearchQuery('');
  };

  const handleSearch = () => {
    // In a real app, this would call an API
    const filtered = searchResults.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );
    setSearchResults(filtered);
  };

  const clearCustomer = () => {
    if (setValue) {
      setValue('customer_name', '');
      setValue('customer_email', '');
      setValue('customer_phone', '');
      setValue('customer_address', '');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowCustomerSearch(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Customer
          </button>
          <button
            type="button"
            onClick={clearCustomer}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </button>
        </div>
      </div>

      {/* Customer Search Modal */}
      {showCustomerSearch && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Search Customer</h3>
                <button
                  onClick={() => setShowCustomerSearch(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by name or phone..."
                    className="flex-1 border rounded-l-md px-3 py-2"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {searchResults.map((customer) => (
                  <div
                    key={customer.id}
                    className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-600">
                      <div>{customer.phone}</div>
                      <div>{customer.email}</div>
                    </div>
                  </div>
                ))}
                
                {searchResults.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No customers found
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    if (setValue) {
                      setValue('customer_name', '');
                      setValue('customer_email', '');
                      setValue('customer_phone', '');
                      setValue('customer_address', '');
                    }
                    setShowCustomerSearch(false);
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
                >
                  Create New Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Controller
              name="customer_name"
              control={control}
              rules={{ required: 'Customer name is required' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition ${
                    errors.customer_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer name"
                />
              )}
            />
          </div>
          {errors.customer_name && (
            <p className="mt-2 text-sm text-red-600">{errors.customer_name.message}</p>
          )}
        </div>

        {/* Customer Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Controller
              name="customer_email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                  placeholder="customer@example.com"
                />
              )}
            />
          </div>
          {errors.customer_email && (
            <p className="mt-2 text-sm text-red-600">{errors.customer_email.message}</p>
          )}
        </div>

        {/* Customer Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Phone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Controller
              name="customer_phone"
              control={control}
              rules={{ 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9+\-\s]+$/,
                  message: 'Invalid phone number'
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition ${
                    errors.customer_phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="01711223344"
                />
              )}
            />
          </div>
          {errors.customer_phone && (
            <p className="mt-2 text-sm text-red-600">{errors.customer_phone.message}</p>
          )}
        </div>

        {/* Company Name (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name (Optional)
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Controller
              name="company_name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                  placeholder="Company Ltd."
                />
              )}
            />
          </div>
        </div>

        {/* Customer Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <Controller
              name="customer_address"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                  placeholder="Full address with city and postal code"
                />
              )}
            />
          </div>
          {errors.customer_address && (
            <p className="mt-2 text-sm text-red-600">{errors.customer_address.message}</p>
          )}
        </div>

        {/* Additional Fields */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Type
            </label>
            <Controller
              name="customer_type"
              control={control}
              defaultValue="retail"
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                >
                  <option value="retail">Retail Customer</option>
                  <option value="wholesale">Wholesale Customer</option>
                  <option value="corporate">Corporate Customer</option>
                  <option value="walkin">Walk-in Customer</option>
                </select>
              )}
            />
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID / VAT Number
            </label>
            <Controller
              name="tax_id"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                  placeholder="Optional"
                />
              )}
            />
          </div>

          {/* Customer Since */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Since
            </label>
            <Controller
              name="customer_since"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                />
              )}
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <Controller
            name="customer_notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
                placeholder="Any special instructions or notes about this customer..."
              />
            )}
          />
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Quick Actions:</p>
              <p className="text-xs mt-1">Select a common customer type</p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (setValue) {
                    setValue('customer_type', 'walkin');
                    setValue('customer_name', 'Walk-in Customer');
                    setValue('customer_phone', '');
                    setValue('customer_email', '');
                  }
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Walk-in
              </button>
              <button
                type="button"
                onClick={() => {
                  if (setValue) {
                    setValue('customer_type', 'retail');
                    setValue('customer_name', 'Retail Customer');
                  }
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Retail
              </button>
              <button
                type="button"
                onClick={() => {
                  if (setValue) {
                    setValue('customer_type', 'wholesale');
                    setValue('company_name', 'Wholesale Buyer');
                  }
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Wholesale
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}