// src/app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // Import the configuration object

// Create the handler function by passing the options to NextAuth
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests.
// This is the standard way to handle API routes in the App Router.
export { handler as GET, handler as POST };