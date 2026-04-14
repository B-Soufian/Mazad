import api from './api';

const authService = {
  // Login with email and password
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.success) {
      // Store the token for future requests
      api.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.error || 'Login failed');
  },

  // Get current authenticated user
  getUser: async () => {
    const response = await api.get('/auth/me');
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch user');
  },

  // Logout and clear token
  logout: async () => {
    try {
      await api.post('/auth/logout', {});
    } finally {
      // Always clear token even if logout fails
      api.clearToken();
    }
  }
};

export default authService;