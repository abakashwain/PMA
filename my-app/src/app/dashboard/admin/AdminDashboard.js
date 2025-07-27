// app/dashboard/admin/AdminDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
// ... keep all your other imports

// The client component for the admin page UI
export default function AdminDashboard() {
  // ... keep all your state variables (activeView, users, roles, etc.)
  const [activeView, setActiveView] = useState('USERS');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... keep modal state variables

  // --- UPDATED DATA FETCHING LOGIC ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch users and roles from our new API endpoints concurrently
        const [usersResponse, rolesResponse] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/roles')
        ]);

        if (!usersResponse.ok || !rolesResponse.ok) {
          throw new Error('Failed to fetch data from the server.');
        }

        const usersData = await usersResponse.json();
        const rolesData = await rolesResponse.json();

        setUsers(usersData);
        setRoles(rolesData);

      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // ... keep all your handler functions (handleSaveItem, handleDeleteItem, etc.)

  // --- UI feedback for loading and error states ---
  if (isLoading) {
    return <div className="text-center text-zinc-400 p-8">Loading data...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-8">Error: {error}</div>;
  }

  // --- Your existing JSX for the dashboard UI ---
  // In the user table, make sure you render the role name correctly.
  // The data structure is now `item.role.name`.
  // Example change in your table body:
  // <td className="p-4">
  //   <span className="...">{item.role ? item.role.name : 'No Role'}</span>
  // </td>
  
  // (The entire return statement with your JSX goes here, unchanged)
  // ...
  return (
    <>
      {/* Paste your full Header, Main, Table, and Modal JSX here */}
    </>
  );
}