import axiosClient from './axiosClient';

export const categoryApi = {
  getAll: async () => {
    const response = await axiosClient.get('/categories');
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosClient.get(`/categories/${id}`);
    return response.data;
  },
  // Admin Only endpoints
  create: async (data) => {
    const response = await axiosClient.post('/admin/categories', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axiosClient.put(`/admin/categories/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosClient.delete(`/admin/categories/${id}`);
    return response.data;
  }
};
