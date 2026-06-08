import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Heart, Bell, UserPlus, ChevronDown, Menu, X } from 'lucide-react';

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggle = () => setOpen((s) => !s);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Auctions', path: '/catalog' },
    { name: 'Create Auction', path: '/sell' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="bg-[#0B0E14] border-b border-white/5 sticky top-0 z-50 transition-all">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" aria-label="Home" className="flex flex-col items-start leading-none" onClick={() => setOpen(false)}>
            <div className="text-2xl font-black text-white tracking-wider">
              MAZAD
            </div>
            <span className="text-[9px] font-bold text-[#d71939] tracking-[0.2em] uppercase mt-1">
              Auctions
            </span>
          </Link>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `text-sm font-bold transition-colors ${isActive ? 'text-[#d71939]' : 'text-gray-300 hover:text-white'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Icons & Auth */}
        <div className="hidden lg:flex items-center gap-6">
          {!user && (
            <Link to="/sell" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-bold transition-colors">
              <UserPlus size={18} /> Become a Seller
            </Link>
          )}

          <div className="w-px h-6 bg-white/10 mx-2"></div>

          {/* <button className="text-gray-300 hover:text-white transition-colors">
            <Heart size={20} />
          </button>

          <button className="text-gray-300 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#d71939] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none border-2 border-[#0B0E14]">
              2
            </span>
          </button>

          <div className="w-px h-6 bg-white/10 mx-2"></div> */}

          {user ? (
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1a1f24] border border-white/10 flex items-center justify-center overflow-hidden">
                  <span className="text-white font-bold text-sm">
                    {user.display_name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white text-sm font-bold">{user.display_name || user.username}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1f24] rounded-xl border border-white/5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                  My Profile
                </button>
                <button onClick={() => navigate('/sell')} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                  Create Auction
                </button>
                <div className="h-px w-full bg-white/5 my-2"></div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-[#d71939] hover:bg-white/5 transition-colors font-medium">
                  Logout
                </button>
              </div>
            </div>
          ) : (
             <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-sm font-bold bg-[#d71939] hover:bg-[#b5142e] text-white px-5 py-2 rounded-lg transition-colors shadow-lg"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
           {user && (
             <button className="text-gray-300 relative">
               <Bell size={20} />
               <span className="absolute -top-1.5 -right-1.5 bg-[#d71939] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none border-2 border-[#0B0E14]">2</span>
             </button>
           )}
           <button className="text-gray-300 hover:text-white transition-colors" onClick={toggle}>
             {open ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-[#0B0E14] border-t border-white/5 px-4 py-6 absolute top-full left-0 w-full shadow-2xl">
          <nav className="flex flex-col gap-4 mb-6">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) => 
                  `text-lg font-bold transition-colors ${isActive ? 'text-[#d71939]' : 'text-gray-300'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="h-px w-full bg-white/5 mb-6"></div>
          
          {user ? (
            <div className="flex flex-col gap-4">
              <button onClick={() => { setOpen(false); navigate('/profile'); }} className="text-left text-lg font-bold text-gray-300">My Profile</button>
              <button onClick={() => { setOpen(false); navigate('/sell'); }} className="text-left text-lg font-bold text-gray-300">Create Auction</button>
              <button onClick={() => { setOpen(false); handleLogout(); }} className="text-left text-lg font-bold text-[#d71939]">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={() => { setOpen(false); navigate('/login'); }} className="w-full bg-white/5 text-white font-bold py-3 rounded-xl border border-white/10">
                Sign In
              </button>
              <button onClick={() => { setOpen(false); navigate('/signup'); }} className="w-full bg-[#d71939] text-white font-bold py-3 rounded-xl">
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
