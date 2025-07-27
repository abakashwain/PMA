// app/api/roles/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET handler to fetch all roles
export async function GET() {
    try {
        const roles = await prisma.role.findMany();
        return NextResponse.json(roles);
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}