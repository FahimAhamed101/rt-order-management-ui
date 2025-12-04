// app/hooks/useAuthSync.js
'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout, setLoading } from '@/app/store/slices/authSlice';

export function useAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ user, accessToken: token }));
      } catch (error) {
        console.error('Failed to parse user data:', error);
    
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
    
    dispatch(setLoading(false));
  }, [dispatch]);
}