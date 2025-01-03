import axiosInstance from '../../utils/axios';

export const cryptoCryptoService = {
  /**
   * Fetches CRYPTO/CRYPTO price data
   * @param {string} symbol - The crypto pair symbol
   * @returns {Promise<number>} The current price
   */
  async getPrice(symbol) {
    const response = await axiosInstance.get(`/api/prices/${symbol}`);
    return Number(response.data.price);
  },

  /**
   * Validates if a symbol is CRYPTO/CRYPTO type
   * @param {string} symbol - The symbol to check
   * @returns {boolean} True if CRYPTO/CRYPTO type
   */
  isCryptoCryptoPair(symbol) {
    const cryptoPairs = ['ETHBTC', 'XRPBTC', 'LTCBTC'];
    return cryptoPairs.includes(symbol);
  },

  /**
   * Gets the base and quote currencies from symbol
   * @param {string} symbol - The symbol to parse
   * @returns {{ base: string, quote: string }} The currencies
   */
  parsePairCurrencies(symbol) {
    const base = symbol.slice(0, 3);
    const quote = symbol.slice(3);
    return { base, quote };
  }
};