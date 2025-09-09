// src/lib/auth.js

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

// 1. EXPORT THE CONFIGURATION OBJECT
// This is the single source of truth for all NextAuth settings.
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (isPasswordValid) return user;
        
        return null;
      },
    }),
  ],
  callbacks: {
    // These callbacks are essential for adding custom data to the session token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: { role: { include: { permissions: true } } },
        });
        if (userWithRole) {
          token.role = userWithRole.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

// 2. EXPORT THE SERVER-SIDE HELPERS
// The `auth` function is used in Server Components (like your dashboard layout).
export const { auth, signIn, signOut } = NextAuth(authOptions);