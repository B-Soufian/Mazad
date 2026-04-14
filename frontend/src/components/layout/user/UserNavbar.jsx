import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const toggle = () => setOpen((s) => !s);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto mb-0 flex items-center justify-between px-4 py-3">
        <div>
          <Link to="/" aria-label="The Curator home" className="inline-block">
            <span className="font-extrabold tracking-wider text-gray-900 text-lg">THE CURATOR</span>
          </Link>
        </div>

        <nav
          className={`${open ? 'absolute left-0 right-0 top-full bg-white shadow-md' : 'hidden'} md:flex md:items-center md:gap-8 md:static md:shadow-none`}
          aria-label="Primary"
        >
          <NavLink to="/" end className={({ isActive }) => isActive ? 'text-red-600 font-semibold' : 'text-gray-600'} onClick={() => setOpen(false)}>
            HOME
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-red-600 font-semibold' : 'text-gray-600'} onClick={() => setOpen(false)}>
            ABOUT
          </NavLink>
          <NavLink to="/catalog" className={({ isActive }) => isActive ? 'text-red-600 font-semibold' : 'text-gray-600'} onClick={() => setOpen(false)}>
            CATALOG
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-red-600 font-semibold' : 'text-gray-600'} onClick={() => setOpen(false)}>
            CONTACT
          </NavLink>
        </nav>

        <div className="md:hidden">
          <button className="p-2" aria-label="Toggle menu" onClick={toggle}>
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth/login')}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
