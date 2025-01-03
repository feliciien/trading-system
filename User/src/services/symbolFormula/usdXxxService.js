import axiosInstance from '../../utils/axios';

export const usdXxxService = {
  /**
   * Fetches USD/XXX price data
   * @param {string} symbol - The currency pair symbol
   * @returns {Promise<number>} The current price
   */
  async getPrice(symbol) {
    const response = await axiosInstance.get(`/api/prices/${symbol}`);
    return Number(response.data.price);
  },

  /**
   * Validates if a symbol is USD/XXX type
   * @param {string} symbol - The symbol to check
   * @returns {boolean} True if USD/XXX type
   */
  isUsdXxxPair(symbol) {
    return /^USD[A-Z]{3}$/.test(symbol);
  }
};