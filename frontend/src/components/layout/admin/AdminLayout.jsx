import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutGrid, Gavel, Layers, Users, BarChart3, 
  Settings, HelpCircle, Search, Bell
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutGrid size={18} />, active: false },
    { name: 'Live Auctions', icon: <Gavel size={18} />, active: true },
    { name: 'Collections', icon: <Layers size={18} />, active: false },
    { name: 'Bidders', icon: <Users size={18} />, active: false },
    { name: 'Analytics', icon: <BarChart3 size={18} />, active: false },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans">
      
      <aside className="w-64 flex-shrink-0 bg-[#0B1120] flex flex-col border-r border-white/5 h-full">
        <div className="p-6 pt-8">
          <h1 className="text-white text-xl font-bold tracking-tight">The Curator</h1>
          <p className="text-[9px] font-bold tracking-[0.15em] text-slate-500 mt-1 uppercase">
            High-Stakes Admin
          </p>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                item.active 
                  ? 'bg-[#D71939] text-white shadow-lg shadow-red-900/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={item.active ? 'text-white' : 'text-slate-500'}>
                {item.icon}
              </span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-4">
          <div className="h-[1px] bg-white/5 mx-2" />

          <button className="w-full bg-[#D71939] hover:bg-[#b51530] text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-red-900/20">
            Start New Auction
          </button>

          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm">
              <Settings size={18} className="text-slate-500" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm">
              <HelpCircle size={18} className="text-slate-500" />
              <span>Support</span>
            </button>
          </div>

          <div className="bg-[#161D2F] p-3 rounded-xl flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-[#242C3D] overflow-hidden flex-shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-xs truncate">The Curator</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        <header className="h-16 flex items-center justify-between px-8 bg-[#F9F9FC] border-b border-slate-200">
          <div className="flex-1 max-w-2xl relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search moderation tasks..." 
              className="w-full pl-11 pr-4 py-2 bg-[#F3F3F6] border-none rounded-full text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 ml-8">
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#D71939] rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <div className="text-sm whitespace-nowrap">
              <span className="text-slate-500 font-medium">Queue Status: </span>
              <span className="text-[#0D6B64] font-bold">12 Pending</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;