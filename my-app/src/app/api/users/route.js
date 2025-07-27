// app/api/users/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET handler to fetch all users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true, // Include the related role information
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// You can add POST, PUT, DELETE handlers here later...