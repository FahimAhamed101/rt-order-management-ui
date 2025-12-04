import { baseApi } from './baseApi';

export interface Product {
  id: number;
  name: string;
  barcode: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRequest {
  name: string;
  barcode: string;
  description?: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    searchProductsForSale: builder.query({
      query: (params) => ({
        url: '/products/search-for-sale',
        params,
      }),
    }),
    getProductByBarcode: builder.query({
      query: (barcode) => `/products/barcode/${barcode}`,
    }),
    getFIFOStock: builder.query({
      query: (id) => `/products/${id}/fifo-stock`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchProductsForSaleQuery,
  useGetProductByBarcodeQuery,
  useGetFIFOStockQuery,
  useLazyGetProductByBarcodeQuery,
  useLazySearchProductsForSaleQuery,
} = productApi;