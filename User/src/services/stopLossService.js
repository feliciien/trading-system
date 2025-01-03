import axiosInstance from '../utils/axios';

export const stopLossService = {
  async updateStopLoss(positionId, updateProfit, updateLoss) {
    try {
      const response = await axiosInstance.post('/updatePosition', {
        positionId, updateProfit, updateLoss
      });
      return response.data;
    } catch (error) {
      console.error('StopLoss update failed:', error);
      throw error;
    }
  },

  async getStopLossStatus(positionId) {
    try {
      const response = await axiosInstance.get(`/position/${positionId}`);
      return response.data.stopLoss;
    } catch (error) {
      console.error('Failed to fetch stop loss status:', error);
      throw error;
    }
  }
};