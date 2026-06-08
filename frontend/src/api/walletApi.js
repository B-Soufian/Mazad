import axiosClient from './axiosClient';

export const walletApi = {
  deposit: async (data) => {
    const response = await axiosClient.post('/wallet/deposit', data);
    return response.data;
  },
  withdraw: async (data) => {
    const response = await axiosClient.post('/wallet/withdraw', data);
    return response.data;
  }
};
