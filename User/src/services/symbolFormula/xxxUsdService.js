import axiosInstance from '../../utils/axios';

export const xxxUsdService = {
  /**
   * Fetches XXX/USD price data
   * @param {string} symbol - The currency pair symbol
   * @returns {Promise<number>} The current price
   */
  async getPrice(symbol) {
    const response = await axiosInstance.get(`/api/prices/${symbol}`);
    return Number(response.data.price);
  },

  /**
   * Validates if a symbol is XXX/USD type
   * @param {string} symbol - The symbol to check
   * @returns {boolean} True if XXX/USD type
   */
  isXxxUsdPair(symbol) {
    return /^[A-Z]{3}USD$/.test(symbol);
  }
};