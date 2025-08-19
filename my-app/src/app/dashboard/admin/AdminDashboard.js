// app/dashboard/admin/AdminDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Users, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('USERS');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/roles'),
      ]);

      if (!usersResponse.ok || !rolesResponse.ok) {
        throw new Error('Failed to fetch data. You might not have permission.');
      }

      const usersData = await usersResponse.json();
      const rolesData = await rolesResponse.json();

      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item = null) => {
    setError(null); // Clear previous errors
    setIsEditing(!!item);
    setCurrentItem(item ? { ...item } : createDefaultItem());
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const createDefaultItem = () => {
    if (activeView === 'USERS') {
      return { name: '', email: '', password: '', roleId: roles[0]?.id || '' };
    }
    return { name: '', permissions: '' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSaveItem = async () => {
    setIsSubmitting(true);
    setError(null);
    
    const url = isEditing
      ? `/api/${activeView.toLowerCase()}/${currentItem.id}`
      : `/api/${activeView.toLowerCase()}`;
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save item.');
      }
      
      await fetchData(); // Refresh data on success
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    const entity = activeView.slice(0, -1).toLowerCase();
    if (confirm(`Are you sure you want to delete this ${entity}?`)) {
      setError(null);
      try {
        const response = await fetch(`/api/${activeView.toLowerCase()}/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.message || `Failed to delete ${entity}.`);
        }
        
        await fetchData(); // Refresh data on success
      } catch (err) {
        setError(err.message);
      }
    }
  };
  
  if (isLoading) return <div className="text-center p-8 text-zinc-400">Loading...</div>;

  // Tables and Modal JSX (no changes from previous answer needed here)
  const renderUsersTable = () => (
    <table className="min-w-full divide-y divide-zinc-700">
      <thead className="bg-zinc-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Role</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-zinc-300 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-zinc-900 divide-y divide-zinc-800">
        {users.map(user => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-100">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role?.name === 'ADMIN' ? 'bg-indigo-500 text-indigo-100' : 'bg-zinc-600 text-zinc-100'}`}>
                {user.role?.name || 'N/A'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button onClick={() => openModal(user)} className="text-indigo-400 hover:text-indigo-300 mr-4"><Edit size={18} /></button>
              <button onClick={() => handleDeleteItem(user.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderRolesTable = () => (
     <table className="min-w-full divide-y divide-zinc-700">
        <thead className="bg-zinc-800">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-300 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody className="bg-zinc-900 divide-y divide-zinc-800">
            {roles.map(role => (
                <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-100">{role.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{role.permissions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openModal(role)} className="text-indigo-400 hover:text-indigo-300 mr-4"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteItem(role.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
  );

  const renderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg p-8 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit' : 'Create'} {activeView.slice(0, -1)}</h2>
        {error && <p className="mb-4 rounded bg-red-900/50 p-3 text-center text-sm text-red-300">{error}</p>}
        {activeView === 'USERS' ? (
          <>
            <input name="name" value={currentItem.name} onChange={handleInputChange} placeholder="Name" className="w-full bg-zinc-700 p-2 rounded mb-4" />
            <input name="email" value={currentItem.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-zinc-700 p-2 rounded mb-4" />
            {!isEditing && <input name="password" type="password" value={currentItem.password} onChange={handleInputChange} placeholder="Password" className="w-full bg-zinc-700 p-2 rounded mb-4" />}
            <select name="roleId" value={currentItem.roleId} onChange={handleInputChange} className="w-full bg-zinc-700 p-2 rounded mb-4">
              {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
          </>
        ) : (
          <>
            <input name="name" value={currentItem.name} onChange={handleInputChange} placeholder="Role Name" className="w-full bg-zinc-700 p-2 rounded mb-4" />
            <input name="permissions" value={currentItem.permissions} onChange={handleInputChange} placeholder="Permissions (comma-separated)" className="w-full bg-zinc-700 p-2 rounded mb-4" />
          </>
        )}
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={closeModal} className="px-4 py-2 bg-zinc-600 rounded hover:bg-zinc-500 disabled:opacity-50" disabled={isSubmitting}>Cancel</button>
          <button onClick={handleSaveItem} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-zinc-400 mt-1">Create, view, edit, and delete users and roles.</p>
      </header>
      
      {error && !isModalOpen && <div className="mb-4 rounded bg-red-900/50 p-3 text-center text-sm text-red-300">{error}</div>}

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 rounded-lg bg-zinc-800 p-1">
            <button onClick={() => setActiveView('USERS')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${activeView === 'USERS' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-700'}`}>
                <Users size={16} /> Users
            </button>
            <button onClick={() => setActiveView('ROLES')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${activeView === 'ROLES' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-700'}`}>
                <Shield size={16} /> Roles
            </button>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          <PlusCircle size={18} /> Create New {activeView.slice(0, -1)}
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        {activeView === 'USERS' ? renderUsersTable() : renderRolesTable()}
      </div>

      {isModalOpen && renderModal()}
    </>
  );
}