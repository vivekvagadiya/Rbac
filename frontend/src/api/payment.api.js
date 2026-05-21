import api from "./axios";
import { endpoints } from "./endpoints";


export const paymentAPI = {
  // Create Stripe checkout session
  createCheckoutSession: async (items) => {
    try {
      const response = await api.post(endpoints.payment.checkout, { items });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel payment session
  cancelPaymentSession: async (sessionId) => {
    try {
      const response = await api.get(
        endpoints.payment.cancel.replace(":sessionId", sessionId),
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify payment session
  verifyPaymentSession: async (sessionId) => {
    try {
      const response = await api.get(
        endpoints.payment.verify.replace(":sessionId", sessionId),
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Export individual functions for backward compatibility
export const createCheckoutSession = paymentAPI.createCheckoutSession;
export const handlePayment = createCheckoutSession;
export const verifyPaymentSession = paymentAPI.verifyPaymentSession;
