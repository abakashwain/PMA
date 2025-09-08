// src/lib/auth.js

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './prisma';
import { authConfig } from './auth.config'; // Import the core config

// Build and export authOptions so other files can import it
export const authOptions = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
};

// Initialize NextAuth with the authOptions and keep existing exports
const nextAuthResult = NextAuth(authOptions);

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = nextAuthResult;