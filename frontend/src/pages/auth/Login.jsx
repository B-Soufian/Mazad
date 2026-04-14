import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, reset } from '../../features/auth/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is already logged in, redirect based on role
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }

    if (isError) {
      alert(message);
    }

    dispatch(reset());
  }, [user, isError, message, navigate, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    // ... (Keep your beautiful UI from before) ...
    <form onSubmit={onSubmit}>
      <input 
        type="email" 
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="example@email.com" 
      />
      <input 
        type="password" 
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="..........." 
      />
      
      <button disabled={isLoading} type="submit">
        {isLoading ? 'Signing in...' : 'SIGN IN'}
      </button>
    </form>
  );
};
export default Login