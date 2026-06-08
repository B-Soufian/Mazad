import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Mail, Phone, Lock } from 'lucide-react';
import { authApi } from '../../api/authApi';

const Register = () => {
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setErrorMsg('');
    try {
      await authApi.register(formData);
      // On success, redirect to login page
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to register. Please check your details.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* LEFT SIDE: FORM SECTION */}
      <section className="w-full lg:w-[45%] p-8 lg:p-20 flex flex-col">
        
        {/* Logo */}
        <div className="mb-16">
          <h2 className="text-gray-400 font-medium tracking-[0.2em] text-xl">Mazad</h2>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-8">
            Create Your Account
          </h1>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <form className="space-y-8" onSubmit={onSubmit}>
            
            {/* Full Name */}
            <InputGroup 
              icon={<User size={22} />} 
              label="Full Name" 
              placeholder="Enter your full name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
            />

            {/* Username */}
            <InputGroup 
              icon={<AtSign size={22} />} 
              label="Username" 
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />

            {/* Email */}
            <InputGroup 
              icon={<Mail size={22} />} 
              label="Email" 
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />

            {/* Phone Number */}
            <InputGroup 
              icon={<Phone size={22} />} 
              label="Phone Number" 
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />

            {/* Password */}
            <InputGroup 
              icon={<Lock size={22} />} 
              label="Password" 
              type="password"
              placeholder="..........."
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />

            {/* Confirm Password */}
            <InputGroup 
              icon={<Lock size={22} />} 
              label="Confirm Password" 
              type="password"
              placeholder="..........."
              value={formData.password_confirmation}
              onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
            />

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={localLoading}
              className="w-full bg-[#8B0E1B] hover:bg-[#7a0c17] disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-all shadow-lg mt-8 text-sm tracking-wider uppercase disabled:cursor-not-allowed"
            >
              {localLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            {/* Footer */}
            <p className="text-center text-gray-500 mt-6 text-sm font-medium">
              Already have an account? <a href="/login" className="text-[#8B0E1B] hover:underline font-bold underline-offset-4 decoration-1">Log in</a>
            </p>
          </form>
        </div>
      </section>

      <section className="hidden lg:flex lg:w-[55%] relative overflow-hidden h-screen sticky top-0">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Architecture" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Hero Text */}
        <div className="relative z-10 w-full flex items-center justify-center p-12 text-center">
          <h2 className="text-white text-7xl font-serif font-bold leading-[1.1] max-w-2xl drop-shadow-2xl">
            Start Your Journey with Mazad
          </h2>
        </div>
      </section>
    </div>
  );
};

const InputGroup = ({ icon, label, placeholder, type = "text", value, onChange }) => (
  <div className="flex items-start gap-4 group">
    <div className="mt-7 text-gray-800 transition-colors group-focus-within:text-[#8B0E1B]">
      {icon}
    </div>
    <div className="flex-1">
      <label className="block text-sm font-bold text-gray-900 mb-1">
        {label}
      </label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border-b border-gray-300 py-2 text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#8B0E1B] focus:border-b-2 bg-transparent"
        required
      />
    </div>
  </div>
);

export default Register;