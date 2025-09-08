// app/api/users/[id]/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// Helper to normalize role from session
function getNormalizedRole(session) {
  const raw = typeof session?.user?.role === 'string' ? session.user.role : session?.user?.role?.name;
  return raw ? String(raw).toUpperCase() : null;
}

// Helper to coerce id for Prisma (number if numeric, otherwise keep string)
function coerceId(id) {
  if (id === undefined || id === null) return id;
  const n = Number(id);
  return Number.isFinite(n) && String(n) === String(id) ? n : id;
}

// PUT: Update a user
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userRole = getNormalizedRole(session);
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = params;
    const idForPrisma = coerceId(id);

    const { name, email, roleId } = await request.json();

    if (!name || !email || (roleId === undefined || roleId === null)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const roleIdForPrisma = coerceId(roleId);

    // Ensure role exists
    const roleExists = await prisma.role.findUnique({ where: { id: roleIdForPrisma } });
    if (!roleExists) {
      return NextResponse.json({ message: 'Invalid roleId' }, { status: 400 });
    }

    // Check if the new email is already taken by another user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && String(existingUser.id) !== String(idForPrisma)) {
      return NextResponse.json({ message: 'Email is already in use by another account' }, { status: 409 });
    }

    // Ensure the user to update exists
    const target = await prisma.user.findUnique({ where: { id: idForPrisma } });
    if (!target) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: idForPrisma },
      data: { name, email, roleId: roleIdForPrisma },
    });

    const { hashedPassword, ...userToReturn } = updatedUser;
    return NextResponse.json(userToReturn);

  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a user
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userRole = getNormalizedRole(session);
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = params;
    const idForPrisma = coerceId(id);

    // Ensure the user to delete exists
    const target = await prisma.user.findUnique({ where: { id: idForPrisma } });
    if (!target) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prevent an admin from deleting their own account
    if (String(session.user.id) === String(idForPrisma)) {
      return NextResponse.json({ message: 'You cannot delete your own account.' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: idForPrisma },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content

  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}