import { baseApi } from './baseApi';

export interface Stock {
  id: number;
  product_id: number;
  sku: string;
  sale_price: number;
  purchase_price: number;
  quantity: number;
  last_updated_at: string;
  created_at: string;
  updated_at: string;
}

export interface StockRequest {
  product_id: number;
  sku: string;
  sale_price: number;
  purchase_price: number;
  quantity: number;
}

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.query({
      query: (params) => ({
        url: '/stocks',
        params,
      }),
      providesTags: ['Stock'],
    }),
    getStock: builder.query({
      query: (id) => `/stocks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Stock', id }],
    }),
    createStock: builder.mutation({
      query: (stock) => ({
        url: '/stocks',
        method: 'POST',
        body: stock,
      }),
      invalidatesTags: ['Stock'],
    }),
    updateStock: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/stocks/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Stock', id }],
    }),
    deleteStock: builder.mutation({
      query: (id) => ({
        url: `/stocks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stock'],
    }),
    updateStockQuantity: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/stocks/${id}/quantity`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Stock'],
    }),
    getLowStock: builder.query({
      query: (params) => ({
        url: '/stocks/low-stock',
        params,
      }),
    }),
    getStockSummary: builder.query({
      query: () => '/stocks/summary',
    }),
    getStockBySku: builder.query({
      query: (sku) => `/stocks/sku/${sku}`,
    }),
    getStockHistory: builder.query({
      query: (productId) => `/stocks/${productId}/history`,
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockQuery,
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
  useUpdateStockQuantityMutation,
  useGetLowStockQuery,
  useGetStockSummaryQuery,
  useGetStockBySkuQuery,
  useGetStockHistoryQuery,
  useLazyGetStockBySkuQuery,
} = stockApi;