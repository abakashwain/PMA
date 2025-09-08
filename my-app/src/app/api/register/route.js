// src/app/api/register/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma'; // Make sure your path alias is working, or use the relative path

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // 3. Find the default 'USER' role
    const userRole = await prisma.role.findUnique({
      where: { name: 'USER' },
    });

    if (!userRole) {
      // This is a server error, the seed should have created the role
      console.error('Default USER role not found.');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }
    
    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 5. Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Make sure field name matches schema
        roleId: userRole.id, // Assign the roleId
      },
    });

    // Don't return the password hash in the response
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('REGISTRATION ERROR:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}