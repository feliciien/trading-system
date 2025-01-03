import axiosInstance from '../../utils/axios';

export const cryptoUsdService = {
  /**
   * Fetches CRYPTO/USD price data
   * @param {string} symbol - The crypto pair symbol
   * @returns {Promise<number>} The current price
   */
  async getPrice(symbol) {
    const response = await axiosInstance.get(`/api/prices/${symbol}`);
    return Number(response.data.price);
  },

  /**
   * Validates if a symbol is CRYPTO/USD type
   * @param {string} symbol - The symbol to check
   * @returns {boolean} True if CRYPTO/USD type
   */
  isCryptoUsdPair(symbol) {
    const cryptoPairs = ['BTCUSD', 'ETHUSD', 'XRPUSD'];
    return cryptoPairs.includes(symbol);
  }
};