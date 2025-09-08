import Link from 'next/link';
import { Shield, Home, Settings, Moon } from 'lucide-react';
import LogoutButton from '../../components/layout/SignOutButton';

// Define navigation links and normalized role names
const navLinks = [
	{ href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['ADMIN', 'MANAGER', 'USER'] },
	{ href: '/dashboard/admin', label: 'User Management', icon: Shield, roles: ['ADMIN'] },
	{ href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'MANAGER'] },
	// add more links as needed
];

export default function Sidebar({ user }) {
	// Support both forms: prisma user.role (object) or session.user.role (string)
	const rawRole = typeof user?.role === 'string' ? user.role : user?.role?.name;
	const userRole = rawRole ? String(rawRole).toUpperCase() : null;

	if (!userRole) {
		return null;
	}

	const accessibleLinks = navLinks.filter(link => link.roles.includes(userRole));

	return (
		<aside className="hidden w-64 flex-col border-r border-zinc-800 bg-zinc-900 p-4 sm:flex">
			<div className="flex h-16 items-center gap-2 px-2">
				<Moon className="h-8 w-8 text-zinc-50" />
				<span className="text-xl font-bold">PropertyPro</span>
			</div>

			<nav className="flex-1 space-y-2 py-4">
				{accessibleLinks.map(link => (
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