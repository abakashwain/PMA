// app/dashboard/Sidebar.jsx

import Link from 'next/link';
import { Shield, Home, Settings, Eclipse } from 'lucide-react';
import LogoutButton from './LogoutButton'; // Import the client component

// Define all possible navigation links and which roles can see them
const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['Administrator', 'Manager', 'User'] },
  { href: '/dashboard/admin', label: 'User Management', icon: Shield, roles: ['Administrator'] },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['Administrator', 'Manager'] },
  // Add more links here for other modules...
];

export default function Sidebar({ user }) {
  // Filter the navigation links based on the current user's role
  const accessibleLinks = navLinks.filter(link => 
    link.roles.includes(user.role.name)
  );

  return (
    <aside className="hidden w-64 flex-col border-r border-zinc-800 bg-zinc-900 p-4 sm:flex">
      <div className="flex h-16 items-center gap-2 px-2">
        <Eclipse className="h-8 w-8 text-zinc-50" />
        <span className="text-xl font-bold">PropertyPro</span>
      </div>
      
      <nav className="flex-1 space-y-2 py-4">
        {accessibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto">
        <div className="p-2 mb-2 border-t border-zinc-800">
          <p className="text-sm font-semibold text-zinc-50">{user.name}</p>
          <p className="text-xs text-zinc-400">{user.email}</p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}