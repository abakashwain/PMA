import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

/** @type {import('next-auth').NextAuthConfig} */
export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  callbacks: {
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

      // Allow access to public pages (like /signin) for unauthenticated users
      return true;
    },
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
  providers: [], // Providers are defined in the main auth.js to keep this file edge-safe
};