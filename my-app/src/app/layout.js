// src/app/layout.js

import './globals.css'; // Your global styles
import { Toaster } from 'react-hot-toast'; // Good for notifications

// It's good practice to manage fonts here
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your App Name',
  description: 'Your App Description',
};

// This is the Root Layout. It wraps every single page in your application.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/*
          Toaster is placed here so notifications can appear on any page,
          including the login page.
        */}
        <Toaster position="top-center" />
        
        {/*
          The `children` prop here will be the page component for a route,
          or a nested layout like your DashboardLayout.
        */}
        {children}
      </body>
    </html>
  );
}