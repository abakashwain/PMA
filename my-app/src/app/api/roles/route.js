// app/api/roles/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Fetch all roles
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'Administrator') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new role
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'Administrator') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { name, permissions } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Role name is required' }, { status: 400 });
    }

    const newRole = await prisma.role.create({
      data: { name, permissions },
    });
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error('Failed to create role:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}