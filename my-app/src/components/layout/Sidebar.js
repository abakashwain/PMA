// src/components/layout/Sidebar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, Building2, Home, Users, FileText, 
  Gavel, KeyRound, Settings, X, Menu
} from 'lucide-react';
import SignOutButton from './SignOutButton';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiredResource: null },
  { href: '/dashboard/portfolio/assets', label: 'Portfolio', icon: Building2, requiredResource: 'ASSET' },
  { href: '/dashboard/spaces', label: 'Spaces', icon: Home, requiredResource: 'SPACE' },
  { href: '/dashboard/leasing/tenants', label: 'Tenants', icon: Users, requiredResource: 'TENANT' },
  { href: '/dashboard/leasing/contracts', label: 'Contracts', icon: FileText, requiredResource: 'CONTRACT' },
  { href: '/dashboard/legal/cases', label: 'Legal Cases', icon: Gavel, requiredResource: 'LEGAL_CASE' },
  { href: '/dashboard/inventory/keys', label: 'Key Management', icon: KeyRound, requiredResource: 'KEY' },
];

const settingsNav = {
  href: '/dashboard/settings/users',
  label: 'Settings',
  icon: Settings,
  requiredResource: ['USER', 'ROLE', 'SYSTEM_SETTING'],
};

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const hasPermission = (resource) => {
    if (!resource) return true;
    if (!user.role?.permissions) return false;

    const check = (res) => user.role.permissions.some(p => p.resource === res && p.canRead);

    if (Array.isArray(resource)) {
      return resource.some(check);
    }
    return check(resource);
  };

  const NavLink = ({ item }) => {
    if (!hasPermission(item.requiredResource)) return null;
    const isActive = pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
    return (
      <li>
        <Link
          href={item.href}
          onClick={() => setIsOpen(false)}
          className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
            isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <item.icon className="h-5 w-5 mr-3" />
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 border-r border-gray-700 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <Link href="/dashboard" className="text-2xl font-bold text-white">YourLogo</Link>
            <button className="lg:hidden p-2 text-white" onClick={() => setIsOpen(false)}><X size={24} /></button>
          </div>
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul>{navItems.map(item => <NavLink key={item.href} item={item} />)}</ul>
            <hr className="my-4 border-gray-600" />
            <ul><NavLink item={settingsNav} /></ul>
          </nav>
          <div className="p-4 border-t border-gray-700"><SignOutButton /></div>
        </div>
      </aside>
    </>
  );
}