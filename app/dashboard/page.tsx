'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetUserQuery, useLogoutMutation } from '@/app/store/api/authApi';

import DashboardCard from '@/app/components/Dashboard/DashboardCard';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
export default function DashboardPage() {
  const router = useRouter();
  //const { data: userData, isLoading: userLoading, error: userError } = useGetUserQuery();
  const [logout] = useLogoutMutation();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

 // if (userLoading) return <div>Loading...</div>;
 // if (userError) return <div>Error loading user data</div>;
  const { user } = useSelector((state: any) => state.auth);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name || 'User'}!
        </p>
      </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
   
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
     
        </div>

    
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/billing')}
              className="bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition"
            >
              Create New Order
            </button>
            <button
              onClick={() => router.push('/products')}
              className="bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition"
            >
              Manage Products
            </button>
            <button
              onClick={() => router.push('/orders')}
              className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition"
            >
              View Orders
            </button>
          </div>
        </div>

    
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <button
              onClick={() => router.push('/orders')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              View all
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}