// src/lib/auth.config.js

import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

/** @type {import('next-auth').NextAuthConfig} */
export const authConfig = {
  // We only define providers and callbacks here.
  // The adapter must be defined in the main auth.js file.
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

        if (!isPasswordValid) return null;

        return user; // Return the full user object
      },
    }),
  ],
  callbacks: {
    // This authorized callback is crucial for middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true; // Allow access if logged in
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // If logged in and on a public page like /signin, redirect to dashboard
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true; // Allow access to public pages for unauthenticated users
    },
    // jwt and session callbacks remain to add role to the session
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
  pages: {
    signIn: '/signin',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};