// app/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginTime: string | null;
}

// Try to load initial state from localStorage
const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastLoginTime: null,
    };
  }

  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('authSlice getInitialState - token exists:', !!token);
    console.log('authSlice getInitialState - user exists:', !!userStr);
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      console.log('authSlice - Loading existing session:', { userId: user.id, email: user.email });
      return {
        user,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        lastLoginTime: localStorage.getItem('lastLoginTime') || null,
      };
    }
  } catch (error) {
    console.error('Failed to parse auth state from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastLoginTime');
  }

  console.log('authSlice - No existing session found');
  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    lastLoginTime: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user credentials after successful login/register
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      const { user, accessToken } = action.payload;
      console.log('authSlice setCredentials called:', { userId: user.id, email: user.email });
      
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.lastLoginTime = new Date().toISOString();
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        console.log('authSlice - Saving to localStorage...');
        try {
          localStorage.setItem('token', accessToken);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('lastLoginTime', state.lastLoginTime);
          console.log('authSlice - localStorage save successful');
          
          // Verify
          const saved = localStorage.getItem('token');
          console.log('authSlice - Verification: token saved =', !!saved);
        } catch (error) {
          console.error('authSlice - localStorage save failed:', error);
        }
      }
    },

    // Update user profile information
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },

    // Update access token (for token refresh)
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isLoading = false;
      state.error = null;
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when loading starts
      }
    },

    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Logout user
    logout: (state) => {
      console.log('authSlice logout called');
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.lastLoginTime = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastLoginTime');
        console.log('authSlice - localStorage cleared');
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset auth state (for testing or special cases)
    resetAuth: () => {
      console.log('authSlice resetAuth called');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastLoginTime');
      }
      return getInitialState();
    },

    // Sync auth state from localStorage (useful for multiple tabs/windows)
    syncFromStorage: (state) => {
      if (typeof window === 'undefined') return;

      console.log('authSlice syncFromStorage called');
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          state.user = user;
          state.accessToken = token;
          state.isAuthenticated = true;
          state.lastLoginTime = localStorage.getItem('lastLoginTime');
          console.log('authSlice - Synced from localStorage:', { userId: user.id });
        } else {
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
          state.lastLoginTime = null;
          console.log('authSlice - No data to sync');
        }
      } catch (error) {
        console.error('Failed to sync auth state from localStorage:', error);
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.lastLoginTime = null;
      }
    },
  },
});

// Export actions
export const {
  setCredentials,
  updateUser,
  updateToken,
  setLoading,
  setError,
  logout,
  clearError,
  resetAuth,
  syncFromStorage,
} = authSlice.actions;

// Export selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectLastLoginTime = (state: { auth: AuthState }) => state.auth.lastLoginTime;

// Export reducer
export default authSlice.reducer;