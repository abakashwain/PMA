// src/components/layout/SignOutButton.jsx
'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';


export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Ask NextAuth not to auto-redirect; we will navigate explicitly
      const res = await signOut({ redirect: false, callbackUrl: '/signin' });
      console.log('signOut result:', res);

      // Force a full-page navigation to ensure cookies/middleware see the updated state
      if (typeof window !== 'undefined') {
        window.location.replace('/signin');
      } else {
        router.replace('/signin');
      }
    } catch (err) {
      console.error('Sign out failed:', err);
      if (typeof window !== 'undefined') {
        window.location.replace('/signin');
      } else {
        router.replace('/signin');
      }
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center p-3 rounded-lg text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
    >
      <LogOut className="h-5 w-5 mr-3" />
      Sign Out
    </button>
  );
}