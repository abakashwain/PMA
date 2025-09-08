// src/app/(dashboard)/layout.js

import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth'; // Adjust path as needed

// This is a Server Component. Its only job is to get the session and build the layout.
export default async function DashboardLayout({ children }) {
  // 1. Fetch the session on the server. This is fast and secure.
  const session = await getServerSession(authOptions);

  // 2. If the user is not logged in, redirect them to the sign-in page.
  // This is the primary security for all dashboard pages.
  if (!session?.user) {
    redirect('/signin');
  }

  // 3. Render the layout structure and pass the user object as a prop
  //    to the child components that need it (`Sidebar` and `Header`).
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Toaster can live here for notifications within the dashboard */}
      <Toaster position="top-center" />
      <div className="flex">
        {/* Pass the user object directly. No providers needed. */}
        <Sidebar user={session.user} />
        
        <main className="flex-1 lg:ml-64">
          <Header user={session.user} />
          <div className="p-4 md:p-8">
            {/* The `children` here will be your specific page, like DashboardPage */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}