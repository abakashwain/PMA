// app/api/roles/[id]/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// PUT: Update a role
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = params;
    const { name, permissions } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Role name is required' }, { status: 400 });
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: { name, permissions },
    });
    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error('Failed to update role:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a role
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = params;

    // IMPORTANT: Check if any users are currently assigned this role
    const usersWithRole = await prisma.user.count({
      where: { roleId: id },
    });

    if (usersWithRole > 0) {
      return NextResponse.json(
        { message: `Cannot delete role. ${usersWithRole} user(s) are currently assigned to it.` },
        { status: 409 } // 409 Conflict
      );
    }
    
    await prisma.role.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete role:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}