// app/dashboard/layout.jsx

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';
// import { PrismaClient } from '@prisma/client';


// const prisma = new PrismaClient();

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Fetch the full user object, including the role, from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      role: true, // This is crucial for role-based access
    },
  });

  if (!user) {
    // This case handles if the user was deleted from the DB but the session still exists
    redirect('/api/auth/signout');
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* This is where the child page (e.g., your admin page) will be rendered */}
        {children}
      </main>
    </div>
  );
}