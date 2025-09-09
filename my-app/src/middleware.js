// src/middleware.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const secret = process.env.NEXTAUTH_SECRET;
  const { pathname } = req.nextUrl;

  // getToken is a lightweight, Edge-safe helper to decrypt the JWT
  const token = await getToken({ req, secret });
  const isAuthenticated = !!token;

  // If trying to access any protected dashboard route without being authenticated,
  // redirect to the sign-in page.
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    const signInUrl = new URL('/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated, prevent access to the sign-in page.
  if (pathname.startsWith('/signin') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Handle the root path
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};