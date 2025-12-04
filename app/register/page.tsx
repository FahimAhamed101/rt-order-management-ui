 // app/components/RegisterPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRegisterMutation } from '@/app/store/api/authApi';
import { setCredentials } from '@/app/store/slices/authSlice';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Building,
  ShieldCheck
} from 'lucide-react';

const registerSchema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;
interface ApiError {
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
  status?: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { isLoading, error }] = useRegisterMutation();
  const apiError = error as ApiError | undefined;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('Submitting registration form:', data);
      const result = await register(data).unwrap();
      console.log('Registration result:', result);
      
  
      if (result.success && result.access_token) {
        console.log('Registration successful!');
        
  
        const user = {
          id: result.id || 0,
          name: result.name || data.name,
          email: result.email || data.email,
          created_at: result.created_at || new Date().toISOString(),
          updated_at: result.updated_at || new Date().toISOString()
        };
        
      
        dispatch(setCredentials({ 
          user, 
          accessToken: result.access_token 
        }));
        
        
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('lastLoginTime', new Date().toISOString());
       
        window.dispatchEvent(new Event('storage'));
        
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };
  // Get error message safely
  const getErrorMessage = () => {
    if (!apiError) return '';
    
    if (apiError.data?.message) {
      return apiError.data.message;
    }
    
    if (apiError.data?.errors) {
      // Get first error message from validation errors
      const firstErrorKey = Object.keys(apiError.data.errors)[0];
      if (firstErrorKey) {
        return apiError.data.errors[firstErrorKey][0];
      }
    }
    
    return 'Registration failed. Please try again.';
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-blue-50">
   
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
       
          <div className="text-center mb-10 md:hidden">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
            
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="h-7 w-7 text-white" />
              </div>
              <h1 className="ml-3 text-3xl font-bold text-gray-900">
                Get Started
              </h1>
            </div>
            <p className="text-gray-600">Create your account to begin</p>
          </div>

         
          <div className="mb-8 hidden md:block">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join our platform and manage your business efficiently</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...registerForm('name')}
                  type="text"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

        
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...registerForm('email')}
                  type="email"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...registerForm('password')}
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
              <div className="mt-2 text-xs text-gray-500">
                Password must be at least 8 characters
              </div>
            </div>

        
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...registerForm('password_confirmation')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-2 text-sm text-red-600">{errors.password_confirmation.message}</p>
              )}
            </div>

        
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

           
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>

    
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-center items-center">
        <div className="max-w-md text-white">
          <div className="flex items-center justify-center mb-8">
            <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <Building className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Welcome!</h1>
              <p className="text-blue-100 mt-2">Join thousands of businesses</p>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Why Join Us?</h2>
            <p className="text-blue-100 mb-8">
              Experience the power of efficient order management and grow your business with our platform.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Secure Platform</p>
                  <p className="text-sm text-blue-200">Your data is always protected</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Easy Setup</p>
                  <p className="text-sm text-blue-200">Get started in minutes</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">24/7 Support</p>
                  <p className="text-sm text-blue-200">We're here to help you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}