// app/dashboard/LogoutButton.jsx

'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })} // Redirect to home page after logout
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:bg-zinc-700 hover:text-zinc-50"
    >
      <LogOut className="h-5 w-5" />
      <span>Logout</span>
    </button>
  );
}