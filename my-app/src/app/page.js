// app/page.jsx

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Property Management Pro</h1>
        <p className="mt-4 text-lg text-zinc-400">The all-in-one solution for managing your properties.</p>
        
        <div className="mt-8">
          {session ? (
            <Link href="/dashboard/admin" className="px-6 py-3 font-bold text-zinc-900 bg-zinc-50 rounded-lg hover:bg-zinc-200">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/api/auth/signin" className="px-6 py-3 font-bold text-zinc-900 bg-zinc-50 rounded-lg hover:bg-zinc-200">
              Login to Get Started
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}