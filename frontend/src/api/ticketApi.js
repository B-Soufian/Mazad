import axiosClient from './axiosClient';

export const ticketApi = {
  getMyTickets: async (page = 1) => {
    const response = await axiosClient.get(`/tickets?page=${page}`);
    return response.data;
  },
  createTicket: async (payload) => {
    const response = await axiosClient.post('/tickets', payload);
    return response.data;
  },
  getTicket: async (id) => {
    const response = await axiosClient.get(`/tickets/${id}`);
    return response.data;
  },
  deleteTicket: async (id) => {
    const response = await axiosClient.delete(`/tickets/${id}`);
    return response.data;
  },

  // Admin
  adminGetTickets: async (page = 1) => {
    const response = await axiosClient.get(`/admin/tickets?page=${page}`);
    return response.data;
  },
  adminReply: async (id, reply) => {
    const response = await axiosClient.patch(`/admin/tickets/${id}/reply`, { reply });
    return response.data;
  },
  adminClose: async (id) => {
    const response = await axiosClient.patch(`/admin/tickets/${id}/close`);
    return response.data;
  }
};
