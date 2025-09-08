// src/components/forms/RegisterForm.jsx

'use client';

import { useState } from 'react';

export default function RegisterForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!name) {
      setError('Name is required for signing up.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setSuccess('Registration successful! Please log in.');
        setTimeout(() => {
          onSuccess();
        }, 2000);
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
  };

  return (
    <>
      {/* UPDATED: Dark theme error/success message styles */}
      {error && (
        <p className="mb-4 rounded-md border border-red-500/30 bg-red-900/50 p-3 text-center text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-md border border-green-500/30 bg-green-900/50 p-3 text-center text-green-400">
          {success}
        </p>
      )}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 shadow-sm placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="email">
            Email Address
          </label>
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
            {isLoading ? 'Processing...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </>
  );
}