import axiosClient from './axiosClient';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await axiosClient.get('/admin/dashboard/stats');
    return response.data;
  },

  getUsers: async (page = 1, search = '') => {
    const response = await axiosClient.get(`/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
    return response.data;
  },

  globalSearch: async (query) => {
    const response = await axiosClient.get(`/admin/global-search?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  approveAuction: async (auctionId) => {
    const response = await axiosClient.patch(`/admin/auctions/${auctionId}/approve`);
    return response.data;
  },
  rejectAuction: async (auctionId, reason = '') => {
    const response = await axiosClient.patch(`/admin/auctions/${auctionId}/reject`, { reason });
    return response.data;
  },

  getLedger: async (page = 1) => {
    const response = await axiosClient.get(`/admin/ledger?page=${page}`);
    return response.data;
  },
};
