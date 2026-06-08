import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setErrorMsg('');
    try {
      await login(formData);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 md:p-10 font-sans">
      
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row h-full min-h-[650px]">
        
        <div className="relative md:w-[60%] w-full min-h-[300px] md:h-auto overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1974&auto=format&fit=crop" 
            alt="Watch mechanism" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative z-10 h-full flex items-center px-12 md:px-20">
            <h1 className="text-white text-5xl md:text-7xl font-serif font-bold leading-[1.1] max-w-lg drop-shadow-lg">
              Welcome Back to the Art of Bidding
            </h1>
          </div>
        </div>

        <div className="md:w-[40%] w-full bg-white p-10 md:p-16 flex flex-col">
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-10">
            Mazad
          </h2>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <form className="flex-1 flex flex-col" onSubmit={onSubmit}>
            
            <div className="mb-10">
              <label className="block text-sm text-gray-800 font-medium mb-1">Email</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="example@email.com"
                className="w-full border-b border-gray-900 py-2 outline-none focus:border-b-2 transition-all"
                required
                autoFocus
              />
            </div>

            <div className="mb-12">
              <label className="block text-sm text-gray-800 font-medium mb-1">Password</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="..........."
                className="w-full border-b border-gray-900 py-2 outline-none focus:border-b-2 transition-all"
                required
              />
            </div>

            <button disabled={localLoading} type="submit" className="w-full bg-[#C10000] hover:bg-[#a00000] text-white py-3.5 rounded-md font-medium text-sm transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
              {localLoading ? 'Signing in...' : 'SIGN IN'}
            </button>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-600 font-medium tracking-tight">
                New to Mazad? <a href="/signup" className="text-black font-bold underline decoration-1 underline-offset-2">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;