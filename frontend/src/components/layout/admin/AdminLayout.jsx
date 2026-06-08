import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { adminApi } from '../../../api/adminApi';
import { LayoutDashboard, Gavel, Users, Tags, ClipboardCheck, LogOut, Search, Bell, Shield, Wallet } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], auctions: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults({ users: [], auctions: [], categories: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await adminApi.globalSearch(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Global search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const navItems = [
    { name: 'DASHBOARD', path: '/admin/dashboard', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
    { name: 'LEDGER', path: '/admin/ledger', icon: <Wallet size={20} strokeWidth={1.5} /> },
    { name: 'APPROVALS', path: '/admin/approvals', icon: <ClipboardCheck size={20} strokeWidth={1.5} /> },
    { name: 'LIVE AUCTIONS', path: '/admin/live-auctions', icon: <Gavel size={20} strokeWidth={1.5} /> },
    { name: 'CATEGORIES', path: '/admin/categories', icon: <Tags size={20} strokeWidth={1.5} /> },
    { name: 'SUPPORT TICKETS', path: '/admin/tickets', icon: <ClipboardCheck size={20} strokeWidth={1.5} /> },
    { name: 'USERS', path: '/admin/users', icon: <Users size={20} strokeWidth={1.5} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch(err) {
       console.error("Logout error", err);
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f4f4f4] font-sans overflow-hidden">
      
      {/* Sidebar matching the User Profile style */}
      <div className="w-full md:w-72 flex-shrink-0 bg-[#0c1220] text-[#7189b6] flex flex-col h-full">
         <div className="p-8 pb-4">
           <div className="flex flex-col items-start leading-none mb-2">
             <div className="text-2xl font-black text-white tracking-wider">
               AUTO<span className="text-[#d71939]">X</span>
             </div>
             <span className="text-[9px] font-bold text-[#d71939] tracking-[0.2em] uppercase mt-1">
               Admin Console
             </span>
           </div>
         </div>

         <nav className="flex flex-col flex-1 overflow-y-auto mt-4">
           {navItems.map((item) => (
             <NavLink
               key={item.name}
               to={item.path}
               className={({ isActive }) => 
                 `flex items-center gap-4 px-8 py-5 transition-all text-sm font-bold tracking-widest ${
                   isActive 
                   ? 'text-white border-l-4 border-[#d71939] bg-white/5' 
                   : 'border-l-4 border-transparent hover:text-white hover:bg-white/5'
                 }`
               }
             >
               {({ isActive }) => (
                 <>
                   <span className={isActive ? "text-white" : "text-[#58739e]"}>{item.icon}</span>
                   <span>{item.name}</span>
                 </>
               )}
             </NavLink>
           ))}
         </nav>

         {/* Logout */}
         <div className="mt-auto pb-8">
            <div className="px-8 py-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a1f24] border border-white/10 flex items-center justify-center">
                <Shield size={20} className="text-[#d71939]" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold">{user?.display_name || 'Admin'}</span>
                <span className="text-xs text-[#58739e]">Super Administrator</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-8 py-5 text-sm font-bold tracking-widest border-l-4 border-transparent hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="text-[#58739e]"><LogOut size={20} strokeWidth={1.5} /></span>
              <span>LOGOUT</span>
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f4f4f4]">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200 shrink-0 shadow-sm">
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              placeholder="Search auctions, users, or categories..." 
              className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#d71939] focus:border-[#d71939] transition-all text-gray-900"
            />

            {showResults && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500 flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#d71939]"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto py-2">
                    {/* Users */}
                    {searchResults.users?.length > 0 && (
                      <div className="px-4 py-2">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Users</h3>
                        {searchResults.users.map(u => (
                          <div key={u.id} className="flex flex-col py-1.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => { navigate('/admin/users'); setShowResults(false); }}>
                            <span className="text-sm font-semibold text-gray-900">{u.display_name}</span>
                            <span className="text-xs text-gray-500">{u.email}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Auctions */}
                    {searchResults.auctions?.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-50">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Auctions</h3>
                        {searchResults.auctions.map(a => (
                          <div key={a.id} className="flex flex-col py-1.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => { navigate('/admin/live-auctions'); setShowResults(false); }}>
                            <span className="text-sm font-semibold text-gray-900">{a.asset?.title}</span>
                            <span className="text-xs text-gray-500">Current: {a.current_price} MAD</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Categories */}
                    {searchResults.categories?.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-50">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Categories</h3>
                        {searchResults.categories.map(c => (
                          <div key={c.id} className="flex flex-col py-1.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => { navigate('/admin/categories'); setShowResults(false); }}>
                            <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!searchResults.users?.length && !searchResults.auctions?.length && !searchResults.categories?.length && (
                      <div className="p-4 text-center text-sm text-gray-500">No results found for "{searchQuery}"</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;