import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/authApi';
import { LayoutDashboard, Gavel, Package, Wallet, Settings, ShieldCheck, LogOut } from 'lucide-react';
import PersonalInfo from './components/PersonalInfo';
import MyAuctionsList from './components/MyAuctionsList';
import MyBidsList from './components/MyBidsList';
import WalletHistory from './components/WalletHistory';
import Tickets from './components/Tickets';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account-settings');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'account-settings', label: 'ACCOUNT SETTINGS', icon: <Settings size={20} strokeWidth={1.5} /> },
    { id: 'my-auctions', label: 'MY AUCTIONS', icon: <Gavel size={20} strokeWidth={1.5} /> },
    { id: 'bidding-hub', label: 'BIDDING HUB', icon: <Gavel size={20} strokeWidth={1.5} /> },
    { id: 'wallet', label: 'WALLET & LEDGER', icon: <Wallet size={20} strokeWidth={1.5} /> },
    { id: 'support-tickets', label: 'SUPPORT TICKETS', icon: <ShieldCheck size={20} strokeWidth={1.5} /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await authApi.getMe();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch(err) {
       console.error("Logout error", err);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (loading) {
     return <div className="p-12 text-center text-gray-500 animate-pulse font-bold">Loading profile...</div>;
  }

  if (!user) {
    return null;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'my-auctions': return <MyAuctionsList />;
      case 'bidding-hub': return <MyBidsList />;
      case 'wallet': return <WalletHistory walletBalance={user.wallet_balance} />;
      case 'support-tickets': return <Tickets />;
      case 'account-settings': return <PersonalInfo user={user} onUserUpdate={setUser} />;
      default: return <PersonalInfo user={user} onUserUpdate={setUser} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f4f4f4] font-sans">
      
      <div className="w-full md:w-72 flex-shrink-0 bg-[#0c1220] text-[#7189b6]">
         <div className="sticky top-0  pb-8 flex flex-col min-h-screen">
           
           <nav className="flex flex-col flex-1">
             {tabs.map((tab) => {
               const isActive = activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-4 px-8 py-5 transition-all text-sm font-bold tracking-widest ${
                     isActive 
                     ? 'text-white border-l-4 border-[#d71939] bg-white/5' 
                     : 'border-l-4 border-transparent hover:text-white hover:bg-white/5'
                   }`}
                 >
                   <span className={isActive ? "text-white" : "text-[#58739e]"}>{tab.icon}</span>
                   <span>{tab.label}</span>
                 </button>
               );
             })}
           </nav>

           {/* Logout */}
           <div className="mt-auto">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-8 py-5 text-sm font-bold tracking-widest border-l-4 border-transparent hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="text-[#58739e]"><LogOut size={20} strokeWidth={1.5} /></span>
                <span>LOGOUT</span>
              </button>
           </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-12 w-full max-w-full overflow-x-hidden">
         {renderActiveTab()}
      </div>

    </div>
  );
};

export default Profile;
