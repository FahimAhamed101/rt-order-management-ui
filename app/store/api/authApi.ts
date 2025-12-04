// app/store/api/authApi.ts
import { baseApi } from './baseApi';
import { setCredentials, logout as authLogout } from '../slices/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  company_name?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  updated_at: string;
  email: string;
  name: string;
  id: number;
  created_at: string;
  success: boolean;
  message: string;
  access_token?: string;
  token?: string;
  token_type?: string;
  expires_in?: number;
  user?: any;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
      transformResponse: (response: AuthResponse) => {
        console.log('Raw login response:', response);
        return response;
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Login onQueryStarted - data:', data);
          
          // Handle both 'access_token' and 'token' field names
          const token = data.access_token || data.token;
          console.log('Extracted token:', token ? 'Token exists' : 'No token');
          
          if (data.success && token && data.user) {
            console.log('All required fields present, updating state...');
            
            // FIRST: Update localStorage (synchronous)
            if (typeof window !== 'undefined') {
              try {
                console.log('Saving to localStorage...');
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('lastLoginTime', new Date().toISOString());
                console.log('localStorage updated successfully');
                
                // Verify it was saved
                const savedToken = localStorage.getItem('token');
                const savedUser = localStorage.getItem('user');
                console.log('Verification - Token saved:', !!savedToken);
                console.log('Verification - User saved:', !!savedUser);
              } catch (storageError) {
                console.error('localStorage error:', storageError);
              }
            }
            
            // THEN: Dispatch to Redux
            console.log('Dispatching to Redux...');
            dispatch(setCredentials({ 
              user: data.user, 
              accessToken: token 
            }));
            console.log('Redux state updated');
          } else {
            console.error('Missing required fields:', { 
              success: data.success, 
              hasToken: !!token, 
              hasUser: !!data.user 
            });
          }
        } catch (error) {
          console.error('Login onQueryStarted error:', error);
        }
      },
    }),
    
   register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Register response in onQueryStarted:', data);
          
          if (data.success && data.access_token) {
            // Create user object from response data (user data is directly in response)
            const user = {
              id: data.id || 0,
              name: data.name || arg.name,
              email: data.email || arg.email,
              created_at: data.created_at || new Date().toISOString(),
              updated_at: data.updated_at || new Date().toISOString()
            };
            
            console.log('Created user object:', user);
            
            // Dispatch to Redux auth slice
            dispatch(setCredentials({ 
              user, 
              accessToken: data.access_token 
            }));
            
            // Store in localStorage
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('lastLoginTime', new Date().toISOString());
            
            console.log('Auth state updated successfully');
          }
        } catch (error) {
          console.error('Registration failed in onQueryStarted:', error);
        }
      },
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log('Logout API call successful');
        } catch (error) {
          console.error('Logout request failed:', error);
        } finally {
          // Always dispatch logout action and clear storage
          console.log('Clearing auth state and localStorage');
          
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('lastLoginTime');
            console.log('localStorage cleared');
          }
          
          dispatch(authLogout());
          console.log('Redux state cleared');
        }
      },
    }),
    
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.access_token || data.token;
          
          if (token && data.user) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            dispatch(setCredentials({ 
              user: data.user, 
              accessToken: token 
            }));
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      },
    }),
    
    getUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetUserQuery,
} = authApi;