import React, { useState } from 'react';
import { profileApi } from '../../../../api/profileApi';
import { Pencil } from 'lucide-react';

const PersonalInfo = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    display_name: user.display_name || '',
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      // Remove empty password so it doesn't get validated/updated unless changed
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }
      
      const response = await profileApi.updateProfile(payload);
      
      if (onUserUpdate && response.user) {
        onUserUpdate(response.user);
      }
      
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err) {
      console.error("Update failed", err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update profile. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out] w-full pt-4 space-y-6 max-w-4xl">
      <h2 className="text-[28px] font-bold text-[#111827] tracking-tight mb-6">My Profile</h2>

      {/* Top Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-3xl font-bold overflow-hidden shadow-inner shrink-0">
               {user.display_name?.charAt(0).toUpperCase()}
            </div>
            <div>
               <h3 className="text-xl font-bold text-[#111827]">{user.display_name}</h3>
               <p className="text-sm font-semibold text-gray-500 mt-1">Mazad Member</p>
               <p className="text-[13px] text-gray-400 mt-0.5">Global</p>
            </div>
         </div>
        
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-[#111827]">Personal information</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Edit <Pencil size={14} />
              </button>
            )}
         </div>

         {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
               {error}
            </div>
         )}

         {isEditing ? (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[#64748b] font-medium text-[13px] mb-2">Display Name</label>
                    <input 
                      type="text" 
                      name="display_name"
                      value={formData.display_name} 
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[#111827] text-[15px] font-semibold focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#64748b] font-medium text-[13px] mb-2">Username</label>
                    <input 
                      type="text" 
                      name="username"
                      value={formData.username} 
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[#111827] text-[15px] font-semibold focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#64748b] font-medium text-[13px] mb-2">Email address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email} 
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[#111827] text-[15px] font-semibold focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#64748b] font-medium text-[13px] mb-2">Phone</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="(Optional)"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[#111827] text-[15px] font-semibold focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]/20 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#64748b] font-medium text-[13px] mb-2">New Password <span className="font-normal text-gray-400">(leave blank to keep current)</span></label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password} 
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[#111827] text-[15px] font-semibold focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]/20 transition-all"
                    />
                  </div>
               </div>
               
               <div className="pt-4 flex gap-4 border-t border-gray-100 mt-8">
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[#0d9488] hover:bg-[#0f766e] transition-colors px-8 py-2.5 rounded-lg text-white font-bold text-[14px] shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={() => {
                       setIsEditing(false);
                       setError('');
                       setFormData({
                         display_name: user.display_name || '',
                         username: user.username || '',
                         email: user.email || '',
                         phone: user.phone || '',
                         password: ''
                       });
                    }}
                    className="bg-white border border-gray-200 hover:bg-gray-50 transition-colors px-8 py-2.5 rounded-lg text-gray-700 font-bold text-[14px]"
                  >
                    Cancel
                  </button>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
               <div>
                 <p className="text-[#64748b] font-medium text-[13px] mb-1.5">Display Name</p>
                 <p className="font-bold text-[#111827] text-[15px]">{user.display_name}</p>
               </div>
               <div>
                 <p className="text-[#64748b] font-medium text-[13px] mb-1.5">Username</p>
                 <p className="font-bold text-[#111827] text-[15px]">{user.username}</p>
               </div>
               <div>
                 <p className="text-[#64748b] font-medium text-[13px] mb-1.5">Email address</p>
                 <p className="font-bold text-[#111827] text-[15px]">{user.email}</p>
               </div>
               <div>
                 <p className="text-[#64748b] font-medium text-[13px] mb-1.5">Phone</p>
                 <p className="font-bold text-[#111827] text-[15px]">{user.phone || '—'}</p>
               </div>
            </div>
         )}
      </div>

    </div>
  );
};

export default PersonalInfo;
