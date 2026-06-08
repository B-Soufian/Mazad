import axiosClient from './axiosClient';

export const assetApi = {
  getAll: async () => {
    const response = await axiosClient.get('/assets');
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosClient.get(`/assets/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axiosClient.post('/assets', data);
    return response.data;
  },
  createWithMedia: async (formData) => {
    const response = await axiosClient.post('/assets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await axiosClient.put(`/assets/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosClient.delete(`/assets/${id}`);
    return response.data;
  }
};
