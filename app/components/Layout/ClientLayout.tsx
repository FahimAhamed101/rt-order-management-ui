// app/components/Layout/ClientLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import { setCredentials, logout } from '@/app/store/slices/authSlice';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const { isAuthenticated, isLoading, user, accessToken } = useSelector((state: any) => state.auth);
  
  // Sync auth from localStorage on mount
  useEffect(() => {
    console.log('ClientLayout - Initializing auth...');
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('ClientLayout - Has token:', !!token);
    console.log('ClientLayout - Has user:', !!userStr);
    console.log('ClientLayout - isAuthenticated:', isAuthenticated);
    
    if (token && userStr && !isAuthenticated) {
      try {
        const user = JSON.parse(userStr);
        console.log('ClientLayout - Restoring session from localStorage');
        dispatch(setCredentials({ user, accessToken: token }));
      } catch (error) {
        console.error('ClientLayout - Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastLoginTime');
      }
    }
    
    setIsInitializing(false);
  }, [dispatch, isAuthenticated]);

  // Check auth status on route change
  useEffect(() => {
    // Don't check auth during initialization
    if (isInitializing) return;

    const noAuthPages = ['/login', '/register', '/forgot-password'];
    const token = localStorage.getItem('token');
    
    console.log('ClientLayout - Route check:', { pathname, hasToken: !!token, isAuthenticated });
    
    if (!token && !noAuthPages.includes(pathname)) {
      // No token and trying to access protected page
      console.log('ClientLayout - No token, redirecting to login');
      router.push('/login');
    } else if (token && noAuthPages.includes(pathname)) {
      // Has token but trying to access auth pages
      console.log('ClientLayout - Has token on auth page, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [pathname, router, isInitializing, isAuthenticated]);

  // Pages where header should not be shown
  const noHeaderPages = ['/login', '/register', '/forgot-password'];
  const showHeader = !noHeaderPages.includes(pathname) && isAuthenticated;

  // Show loading state during initialization or when loading
  if (isInitializing || (isLoading && !noHeaderPages.includes(pathname))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <>
          <Header 
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
            isMenuOpen={isMenuOpen}
          />
          <div className="flex">
            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </>
      )}
      {!showHeader && children}
    </div>
  );
}