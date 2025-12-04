// app/components/LoginPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useLoginMutation } from '@/app/store/api/authApi';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Building,
  ShoppingCart
} from 'lucide-react';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;


interface ApiError {
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
  status?: number;
}
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
   const apiError = error as ApiError | undefined;

  const { isAuthenticated } = useSelector((state: any) => state.auth);


  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Submitting login form:', data);
      const result = await login(data).unwrap();
      console.log('Login result:', result);
      
   
      const token = result.access_token || result.token;
      
      if (result.success && token) {
        console.log('Login successful!');
        console.log('Token:', token);
        console.log('User:', result.user);
        
  
        if (typeof window !== 'undefined') {
          const savedToken = localStorage.getItem('token');
          const savedUser = localStorage.getItem('user');
          
          if (!savedToken || !savedUser) {
            console.log('localStorage not set by authApi, setting manually...');
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('lastLoginTime', new Date().toISOString());
          }
          
          // Final verification
          console.log('Final localStorage check:');
          console.log('- Token exists:', !!localStorage.getItem('token'));
          console.log('- User exists:', !!localStorage.getItem('user'));
        }
        
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  const getErrorMessage = () => {
    if (!apiError) return '';
    
    if (apiError.data?.message) {
      return apiError.data.message;
    }
    
    if (apiError.data?.errors) {

      const firstErrorKey = Object.keys(apiError.data.errors)[0];
      if (firstErrorKey) {
        return apiError.data.errors[firstErrorKey][0];
      }
    }
    
    return 'Registration failed. Please try again.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className=" w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex items-center justify-center">
   

      
          <div className="md:w-2/5 p-8 md:p-12">
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-2xl font-bold text-gray-900">
                  Order<span className="text-blue-600">Manager</span>
                </h1>
              </div>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    {...register('email')}
                    type="email"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                    placeholder="you@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
     {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">
                  {getErrorMessage()}
                </p>
              </div>
            )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}