import axiosInstance from '../utils/axios';

export const buyOrderService = {
  async createBuyStopOrder(orderData) {
    try {
      const response = await axiosInstance.post('/orders/buyStop', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create buy stop order:', error);
      throw error;
    }
  },

  async createBuyLimitOrder(orderData) {
    try {
      const response = await axiosInstance.post('/orders/buyLimit', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create buy limit order:', error);
      throw error;
    }
  },

  async cancelOrder(orderId) {
    try {
      const response = await axiosInstance.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }
};