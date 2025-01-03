import api from '../utils/api';

export const indicesService = {
  async getPrice(symbol) {
    try {
      const response = await api.get(`/indices/${symbol}/price`);
      return response.data.price;
    } catch (error) {
      throw new Error(`Failed to fetch ${symbol} price: ${error.message}`);
    }
  },

  async validatePrice(price, symbol) {
    try {
      const response = await api.post('/indices/validate', { price, symbol });
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  }
};