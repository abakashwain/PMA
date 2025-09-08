// src/components/forms/LoginForm.jsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      } else if (result.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* UPDATED: Dark theme error message style */}
      {error && (
        <p className="mb-4 rounded-md border border-red-500/30 bg-red-900/50 p-3 text-center text-red-400">
          {error}
        </p>
      )}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          {/* UPDATED: Light text color for label */}
          <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="email">
            Email Address
          </label>
          {/* UPDATED: Dark theme input field style */}
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 shadow-sm placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 shadow-sm placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Log In'}
          </button>
        </div>
      </form>
    </>
  );
}