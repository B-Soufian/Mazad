import axiosClient from './axiosClient';

export const authApi = {
  register: async (data) => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  },
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  }
};
