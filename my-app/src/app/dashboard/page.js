// app/dashboard/page.jsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // session is guaranteed to exist by the layout
  const user = session.user;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}!</h1>
      <p className="mt-2 text-zinc-400">
        You are logged in as a(n) <span className="font-semibold text-indigo-400">{user.role}</span>.
      </p>
      <div className="mt-6 rounded-lg bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">Your Dashboard</h2>
        <p className="mt-2 text-zinc-400">
          This is your main dashboard view. Use the sidebar to navigate to other sections.
        </p>
      </div>
    </div>
  );
}