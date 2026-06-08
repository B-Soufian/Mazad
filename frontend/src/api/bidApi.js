import axiosClient from './axiosClient';

export const bidApi = {
  placeBid: async (data) => {
    const response = await axiosClient.post('/bids', data);
    return response.data;
  },
  buyNow: async (auctionId) => {
    const response = await axiosClient.post(`/auctions/${auctionId}/buy-now`);
    return response.data;
  }
};
