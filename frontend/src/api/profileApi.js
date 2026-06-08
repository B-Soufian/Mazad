import axiosClient from './axiosClient';

export const profileApi = {
  getMyAssets: async () => {
    const response = await axiosClient.get('/my/assets');
    return response.data;
  },
  getMyAuctions: async (page = 1, search = '') => {
    const response = await axiosClient.get(`/my/auctions?page=${page}&search=${encodeURIComponent(search)}`);
    return response.data;
  },
  getMyBids: async () => {
    const response = await axiosClient.get('/my/bids');
    return response.data;
  },
  getMyTransactions: async () => {
    const response = await axiosClient.get('/my/transactions');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await axiosClient.put('/my/profile', data);
    return response.data;
  }
};
