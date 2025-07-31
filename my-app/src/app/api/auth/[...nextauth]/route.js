// File: app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@/lib/client';
import GoogleProvider from "next-auth/providers/google";
// Add other providers like CredentialsProvider if you use them

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ... add more providers here
  ],
  session: {
    strategy: "jwt", // Using JWT is recommended for custom callbacks
  },
  callbacks: {
    // This callback adds the role to the JWT token upon sign-in
    async jwt({ token, user }) {
      if (user) {
        // On sign-in, `user` object is available.
        // We need to fetch the role name from the related Role model.
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: { role: true },
        });
        if (userWithRole) {
          token.role = userWithRole.role.name; // e.g., "ADMIN" or "USER"
          token.id = user.id;
        }
      }
      return token;
    },
    // This callback adds the role from the token to the client-side session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role; // Add role from token to session
        session.user.id = token.id;     // Add id from token to session
      }
      return session;
    },
  },
};

// The handler for the App Router
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };