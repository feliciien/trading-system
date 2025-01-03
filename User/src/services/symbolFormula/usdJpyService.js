import axiosInstance from '../../utils/axios';

export const usdJpyService = {
  /**
   * Fetches USD/JPY price data
   * @param {string} symbol - The currency pair symbol
   * @returns {Promise<number>} The current price
   */
  async getPrice(symbol) {
    const response = await axiosInstance.get(`/api/prices/${symbol}`);
    return Number(response.data.price);
  },

  /**
   * Validates if a symbol is USD/JPY type
   * @param {string} symbol - The symbol to check
   * @returns {boolean} True if USD/JPY type
   */
  isUsdJpyPair(symbol) {
    return symbol === 'USDJPY';
  }
};