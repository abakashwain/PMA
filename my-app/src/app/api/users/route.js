// app/api/users/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

// GET: Fetch all users
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'Administrator') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
    // Exclude password hashes from the response
    const usersWithoutPasswords = users.map(({ hashedPassword, ...user }) => user);
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'Administrator') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { name, email, password, roleId } = body;

    if (!name || !email || !password || !roleId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        roleId,
      },
    });

    const { hashedPassword: _, ...userToReturn } = newUser;
    return NextResponse.json(userToReturn, { status: 201 });

  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}