// app/admin/page.jsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

// Import the Client Component we just created
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    // 1. If no session exists, redirect the user to the login page
    if (!session) {
        // The default NextAuth sign-in page is at /api/auth/signin
        // The callbackUrl will send them back here after they log in.
        redirect('/api/auth/signin?callbackUrl=/admin');
    }

    // 2. If a session exists, render the full interactive dashboard
    return (
        <div className="flex justify-center items-start min-h-screen bg-zinc-950 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-6xl p-6 sm:p-8 bg-zinc-900 rounded-2xl shadow-2xl shadow-zinc-950/50">
                <AdminDashboard />
            </div>
        </div>
    );
}