// src/app/login/page.jsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // State to toggle between Login and Sign Up forms
  const [isLogin, setIsLogin] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (isLogin) {
      // --- LOGIN LOGIC ---
      try {
        const result = await signIn('credentials', {
          redirect: false, // Do not redirect automatically
          email,
          password,
        });

        if (result.error) {
          setError('Invalid email or password. Please try again.');
          setIsLoading(false);
        } else if (result.ok) {
          // Redirect to a protected page on successful login
          router.push('/dashboard/admin');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
    } else {
      // --- SIGN UP LOGIC ---
      if (!name) {
         setError('Name is required for signing up.');
         setIsLoading(false);
         return;
      }
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
          setSuccess('Registration successful! Please log in.');
          setIsLogin(true); // Switch to login form
          // Clear form fields
          setName('');
          setEmail('');
          setPassword('');
        } else {
          const data = await res.json();
          setError(data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {error && <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-red-600">{error}</p>}
        {success && <p className="mb-4 rounded-md bg-green-100 p-3 text-center text-green-600">{success}</p>}

        <form onSubmit={handleFormSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={toggleForm} className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}