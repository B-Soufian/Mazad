import axiosClient from './axiosClient';

export const auctionApi = {
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/auctions', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosClient.get(`/auctions/${id}`);
    return response.data;
  },
  getSimilar: async (id) => {
    const response = await axiosClient.get(`/auctions/${id}/similar`);
    return response.data;
  },
  create: async (data) => {
    const response = await axiosClient.post('/auctions', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axiosClient.put(`/auctions/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosClient.delete(`/auctions/${id}`);
    return response.data;
  }
};
