// File: app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import  CredentialsProvider from 'next-auth/providers/credentials';

//The PrismaAdaptor is used for Third Party Providers.
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

// Add other providers like CredentialsProvider if you use them

export const authOptions = {
  
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Passwordd', type: 'password' },
      },
      // This is the core logic that runs when a user tries to log in
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        // 1. Find the user in your database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            role: true, // IMPORTANT: Include the role relation
          }
        });

        if (!user) {
          // Not found
          return null;
        }

        // 2. Check if the user has a password (they might be a legacy Google user)
        if (!user.hashedPassword) {
          return null;
        }

        // 3. Compare the provided password with the stored hashed password
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!passwordsMatch) {
          return null;
        }

        // 4. If everything is correct, return the user object
        // The user object will be encoded in the JWT
        return user;
      },
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
        // When the user first signs in, the `user` object is available.
        // We add the user's ID and role to the token.
        token.id = user.id;
        token.role = user.role.name;
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
  pages: {
    signIn: '/login', // Redirect users to your custom login page
    // error: '/auth/error', // You can specify a custom error page
  },
};

// The handler for the App Router
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };