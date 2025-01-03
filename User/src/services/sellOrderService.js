import axiosInstance from '../utils/axios';

export const sellOrderService = {
  async createSellStopOrder(orderData) {
    try {
      const response = await axiosInstance.post('/orders/sellStop', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create sell stop order:', error);
      throw error;
    }
  },

  async createSellLimitOrder(orderData) {
    try {
      const response = await axiosInstance.post('/orders/sellLimit', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create sell limit order:', error);
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