
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
 
    return action.type.includes('executeQuery') || 
           action.type.includes('query/');
  },
  effect: async (action, listenerApi) => {
    const token = localStorage.getItem('accesstoken');
    
   
    if (!token && !window.location.pathname.includes('/login') && 
        !window.location.pathname.includes('/register')) {
      listenerApi.dispatch(logout());
      window.location.href = '/login';
    }
  },
});