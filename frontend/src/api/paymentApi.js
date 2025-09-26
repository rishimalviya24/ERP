// services/api/paymentApi.js
import axiosInstance from '../utils/axiosInstance';

export const paymentApi = {
  // Create a Razorpay order (or your gateway order)
  createOrder: async (invoiceId) => {
    const response = await axiosInstance.post('/payments/create-order', {
      invoiceId,
    });
    return response.data;
  },

  // Verify a payment after user completes it
  verifyPayment: async (paymentData) => {
    const response = await axiosInstance.post('/payments/verify', paymentData);
    return response.data;
  },

  // Fetch payment history
  getPaymentHistory: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/payments/history', {
      params: { page, limit },
    });
    return response.data;
  },
};
