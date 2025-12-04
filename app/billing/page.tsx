'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateOrderMutation } from '@/app/store/api/orderApi';
import { useSearchProductsForSaleQuery } from '@/app/store/api/productApi';
import { useRouter } from 'next/navigation';
import ProductSearch from './ProductSearch';
import OrderSummary from './OrderSummary';
import CustomerForm from './CustomerForm';

interface OrderItem {
  stock_id: number;
  product_id: number;
  name: string;
  sku: string;
  sale_price: number;
  quantity: number;
  available: number;
}

export default function BillingPage() {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
  const { data: productsData } = useSearchProductsForSaleQuery({});
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      customer_address: '',
      payment_method: 'cash',
      discount: 0,
      tax: 0,
      shipping_charge: 0,
      notes: '',
    },
  });

  const addProductToOrder = (product: any) => {
    const existingItem = orderItems.find(item => item.stock_id === product.fifo_stock.id);
    
    if (existingItem) {
      if (existingItem.quantity < existingItem.available) {
        setOrderItems(items =>
          items.map(item =>
            item.stock_id === product.fifo_stock.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else {
      setOrderItems([
        ...orderItems,
        {
          stock_id: product.fifo_stock.id,
          product_id: product.id,
          name: product.name,
          sku: product.fifo_stock.sku,
          sale_price: product.fifo_stock.sale_price,
          quantity: 1,
          available: product.fifo_stock.quantity,
        },
      ]);
    }
  };

  const updateQuantity = (stockId: number, quantity: number) => {
    setOrderItems(items =>
      items.map(item =>
        item.stock_id === stockId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (stockId: number) => {
    setOrderItems(items => items.filter(item => item.stock_id !== stockId));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.sale_price * item.quantity), 0);
  };

  const onSubmit = async (customerData: any) => {
    try {
      const orderData = {
        ...customerData,
        products: orderItems.map(item => ({
          stock_id: item.stock_id,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(orderData).unwrap();
      if (result.success) {
        alert('Order created successfully!');
        router.push(`/orders/${result.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Order</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer & Product Search */}
          <div className="lg:col-span-2 space-y-8">
            <CustomerForm control={control} errors={errors} />
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add Products</h2>
              <ProductSearch
                products={productsData?.data?.data || []}
                onAddProduct={addProductToOrder}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={orderItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              subtotal={calculateSubtotal()}
              onSubmit={handleSubmit(onSubmit)}
              isLoading={isLoading}
              control={control}
            />
          </div>
        </div>
      </div>
    </div>
  );
}