import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/adminApi';
import { MoreVertical, Search, Users } from 'lucide-react';

const avatarColors = [
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-blue-100 text-blue-700',
  'bg-rose-100 text-rose-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
];

const getInitials = (name) =>
  name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

const UserManagement = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getUsers(page, search);
        setUsers(data.data || []);
        setTotalPages(data.last_page || 1);
        setTotalUsers(data.total || 0);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-2">Manage and review registered platform users.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <Users size={16} className="text-blue-600" />
          <span className="text-sm font-bold text-blue-700">{totalUsers} Total Users</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or username..."
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d71939] focus:border-[#d71939] shadow-sm transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">Full Name & Status</div>
          <div className="col-span-3">Email Address</div>
          <div className="col-span-2 text-center">Total Bids</div>
          <div className="col-span-2 text-right">Wallet Balance</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No users found.</div>
          ) : (
            users.map((user, index) => {
              const colorClass = avatarColors[index % avatarColors.length];
              return (
                <div
                  key={user.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50/50 transition-colors group"
                >
                  {/* Name & Status */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${colorClass}`}>
                      {getInitials(user.display_name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{user.display_name}</h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {user.role?.toUpperCase() || 'USER'}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3 text-gray-500 text-sm truncate">
                    {user.email}
                  </div>

                  {/* Total Bids */}
                  <div className="col-span-2 flex md:justify-center">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-bold text-xs">
                      {user.bids_count || 0}
                    </div>
                  </div>

                  {/* Wallet Balance */}
                  <div className="col-span-2 text-right">
                    <p className={`font-bold text-sm ${user.wallet_balance > 0 ? 'text-teal-700' : 'text-gray-400'}`}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(user.wallet_balance || 0)}
                    </p>
                    {user.frozen_balance > 0 && (
                      <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(user.frozen_balance)} frozen
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <button className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-bold text-gray-500">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;