'use client';

import { Control } from 'react-hook-form';
import { Trash2 } from 'lucide-react';

interface OrderItem {
  stock_id: number;
  name: string;
  sku: string;
  sale_price: number;
  quantity: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (stockId: number, quantity: number) => void;
  onRemoveItem: (stockId: number) => void;
  subtotal: number;
  onSubmit: () => void;
  isLoading: boolean;
  control: Control<any>;
}

export default function OrderSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
  onSubmit,
  isLoading,
}: OrderSummaryProps) {
  const calculateTotal = () => {
    return subtotal;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.stock_id} className="border rounded-md p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">SKU: {item.sku}</p>
              </div>
              <button
                onClick={() => onRemoveItem(item.stock_id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.stock_id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border rounded-md"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.stock_id, parseInt(e.target.value) || 1)}
                  className="w-16 text-center border rounded-md py-1"
                />
                <button
                  onClick={() => onUpdateQuantity(item.stock_id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded-md"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <div className="font-medium">${(item.sale_price * item.quantity).toFixed(2)}</div>
                <div className="text-sm text-gray-600">${item.sale_price} each</div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items in order
          </div>
        )}
      </div>

      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={items.length === 0 || isLoading}
        className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Order...' : 'Place Order'}
      </button>
    </div>
  );
}