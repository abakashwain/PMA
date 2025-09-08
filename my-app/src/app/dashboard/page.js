// src/app/dashboard/page.js

import prisma from '@/lib/prisma';
import StatCard from '@/components/dashboard/StatCard';
import { Building, Home, Users, Gavel } from 'lucide-react';

async function getDashboardStats() {
  try {
    const [
      totalAssets,
      totalLeasableSpaces,
      occupiedSpaces,
      totalTenants,
      openLegalCases
    ] = await prisma.$transaction([
      prisma.asset.count({ where: { deletedAt: null } }),
      prisma.space.count({ where: { deletedAt: null, spaceType: { isLeasable: true } } }),
      prisma.space.count({ where: { deletedAt: null, occupancyStatus: 'OCCUPIED' } }),
      prisma.tenant.count({ where: { deletedAt: null } }),
      prisma.legalCase.count({ where: { status: 'OPEN', deletedAt: null } }),
    ]);

    const occupancyRate = totalLeasableSpaces > 0 ? ((occupiedSpaces / totalLeasableSpaces) * 100).toFixed(1) : 0;

    return { 
      totalAssets, 
      occupiedSpaces,
      occupancyRate,
      totalTenants,
      openLegalCases 
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalAssets: 0, 
      occupiedSpaces: 0,
      occupancyRate: 'N/A',
      totalTenants: 0,
      openLegalCases: 0
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Assets" value={stats.totalAssets} icon={Building} color="bg-blue-600" />
        <StatCard title="Occupied Spaces" value={stats.occupiedSpaces} icon={Home} color="bg-green-600" />
        <StatCard title="Active Tenants" value={stats.totalTenants} icon={Users} color="bg-yellow-600" />
        <StatCard title="Open Legal Cases" value={stats.openLegalCases} icon={Gavel} color="bg-red-600" />
      </div>
      <div className="mt-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 min-h-[300px]">
          <h2 className="text-xl font-semibold mb-4">Occupancy Rate: {stats.occupancyRate}%</h2>
        </div>
      </div>
    </div>
  );
}