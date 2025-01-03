import axiosInstance from '../../utils/axios';

export const jpyXxxService = {
  /**
   * Fetches JPY/XXX price data
   * @param {string} symbol - The currency pair symbol
   * @returns {Promise<number>} The current price
   */
  async getPrice(symbol) {
    const response = await axiosInstance.get(`/api/prices/${symbol}`);
    return Number(response.data.price);
  },

  /**
   * Validates if a symbol is JPY/XXX type
   * @param {string} symbol - The symbol to check
   * @returns {boolean} True if JPY/XXX type
   */
  isJpyXxxPair(symbol) {
    return /^JPY[A-Z]{3}$/.test(symbol);
  }
};