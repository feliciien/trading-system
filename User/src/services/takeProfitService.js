import axios from 'axios';
import { API_BASE_URL } from '../config';

export const takeProfitService = {
  verifyTakeProfit: async (position) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/positions/verify-take-profit`, position);
      return response.data;
    } catch (error) {
      console.error('Take profit verification failed:', error);
      throw error;
    }
  },

  executeTakeProfit: async (positionId, currentPrice) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/positions/execute-take-profit`, {
        positionId,
        currentPrice
      });
      return response.data;
    } catch (error) {
      console.error('Take profit execution failed:', error);
      throw error;
    }
  }
};