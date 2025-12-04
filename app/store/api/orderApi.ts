import { baseApi } from './baseApi';

export interface OrderProduct {
  stock_id: number;
  quantity: number;
}

export interface OrderRequest {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  products: OrderProduct[];
  payment_method?: string;
  payment_status?: string;
  paid_amount?: number;
  discount?: number;
  tax?: number;
  shipping_charge?: number;
  notes?: string;
}

export interface Order {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  date_time: string;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  payment_method: string;
  payment_status: string;
  sub_total: number;
  discount: number;
  tax: number;
  shipping_charge: number;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order', 'Stock'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Stock'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order', 'Stock'],
    }),
    fakePayment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/orders/${id}/fake-payment`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Stock'],
    }),
    getOrderByInvoice: builder.query({
      query: (invoiceNumber) => `/orders/invoice/${invoiceNumber}`,
    }),
    getOrderStatistics: builder.query({
      query: (params) => ({
        url: '/orders/statistics',
        params,
      }),
    }),
    getDailySales: builder.query({
      query: (params) => ({
        url: '/orders/daily-sales',
        params,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useFakePaymentMutation,
  useUpdateOrderStatusMutation,
  useGetOrderByInvoiceQuery,
  useGetOrderStatisticsQuery,
  useGetDailySalesQuery,
  useLazyGetOrdersQuery,
  useLazyGetOrderByInvoiceQuery,
} = orderApi;