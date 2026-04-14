import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };



  const avatarColors = ['bg-[#81E6D9]', 'bg-[#F6AD55]', 'bg-[#E2E8F0]', 'bg-[#76E4F7]'];

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-2 text-base font-medium">
            Reviewing high-net-worth participants and institutional buyers.
          </p>
        </div>
        <div className="bg-[#F1F5F9] px-4 py-2 rounded-lg text-sm font-medium border border-slate-200">
          <span className="text-slate-500">Total Participants: </span>
          <span className="text-slate-900 font-bold">14,208</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-[1.5fr,1.5fr,1fr,1fr,50px] bg-[#F8FAFC] px-8 py-5 border-b border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Name & Status</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email Address</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Bids</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right pr-10">Wallet Balance</div>
          <div></div>
        </div>

        <div className="divide-y divide-slate-50">
          {users.map((user, index) => {
            const avatarColor = avatarColors[index % avatarColors.length];
            
            return (
              <div key={user.id} className="grid grid-cols-[1.5fr,1.5fr,1fr,1fr,50px] items-center px-8 py-6 hover:bg-slate-50 transition-colors group">
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-700 ${avatarColor}`}>
                    {getInitials(user.displayName)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px]">{user.displayName}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black tracking-tighter bg-[#0D6B64] text-white`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="text-slate-500 text-sm font-medium">
                  {user.email}
                </div>

                <div className="text-slate-500 text-sm font-medium">
                  {user.stats?.totalBids > 0 ? `${user.stats.totalBids} Activity Points` : 'None'}
                </div>

                <div className="text-right pr-10">
                  <p className={`font-bold text-[15px] ${user.wallet.walletBalance > 0 ? 'text-[#0D6B64]' : 'text-slate-400'}`}>
                    {user.wallet.currency} {user.wallet.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;