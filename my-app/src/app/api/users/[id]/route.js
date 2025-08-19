// app/api/users/[id]/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// PUT: Update a user
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'Administrator') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = params;
    const { name, email, roleId } = await request.json();

    if (!name || !email || !roleId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if the new email is already taken by another user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== id) {
        return NextResponse.json({ message: 'Email is already in use by another account' }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, roleId },
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
  if (session?.user?.role !== 'Administrator') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = params;

    // Prevent an admin from deleting their own account
    if (session.user.id === id) {
      return NextResponse.json({ message: 'You cannot delete your own account.' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content

  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}