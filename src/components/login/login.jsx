'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('Form submission started');
      console.log('Form data:', { ...formData, password: '***' });

      // Validate passwords match for registration
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      console.log('Making API request to:', `${apiUrl}${endpoint}`);
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isLogin) {
        // Store the token and user info
        console.log('=== Login Response Data ===');
        console.log('Received data from server:', { ...data, token: '***' });
        
        if (!data.name) {
          console.error('No user name received from server');
          setError('Error: No user data received');
          return;
        }

        // Store user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userRole', data.role);
        
        console.log('Stored user data in localStorage:', {
          name: data.name,
          email: data.email,
          id: data.id,
          role: data.role
        });
        
        // Update state before redirect
        setSuccess('Login successful! Redirecting...');
        
        // Force a small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Restore original router.push logic for admin
        if (data.role === 'admin') {
          router.push('/admin');
          setTimeout(() => {
            if (window.location.pathname !== '/admin') {
              window.location.href = '/admin';
            }
          }, 1000);
        } else {
          // Check if there's an intended room to redirect to
          const intendedRoomId = localStorage.getItem('intendedRoomId');
          if (intendedRoomId) {
            localStorage.removeItem('intendedRoomId'); // Clear the intended room
            router.push(`/room/${intendedRoomId}`);
          } else {
            router.push('/');
          }
        }
      } else {
        // After registration, store user data and show success message
        console.log('Registration successful, storing user data:', { ...data, token: '***' });
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userRole', data.role);
        
        setSuccess('Registration successful! Redirecting...');
        
        // Force a small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect based on user role (new users are always 'user' role)
        router.push('/');
      }
    } catch (err) {
      console.error('Error during authentication:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto space-y-4"
      >
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-2 shadow">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-xs">
            {isLogin ? 'Sign in to your account' : 'Join our professional platform'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {!isLogin && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
              required={!isLogin}
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-10 pr-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {!isLogin && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
              required={!isLogin}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )}

        {isLogin && (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
          {isLogin ? 'Sign In' : 'Create Account'}
          <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="mt-2 text-center">
          <p className="text-gray-600 text-xs">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={toggleAuthMode}
            className="mt-1 text-blue-600 hover:text-blue-800 font-semibold hover:underline text-xs"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-3 px-4 rounded-lg border border-blue-200 bg-blue-50/30 text-gray-700 hover:bg-blue-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button className="w-full inline-flex justify-center py-3 px-4 rounded-lg border border-blue-200 bg-blue-50/30 text-gray-700 hover:bg-blue-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045C7.525 8.978 3.897 7.018 1.468 4.039.178 6.252.799 9.147 2.991 10.613c-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04C5.378 23.2 7.967 24 10.747 24c9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
