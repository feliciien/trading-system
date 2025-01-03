import axiosInstance from '../../utils/axios';

export const xxxYyyService = {
  /**
   * Fetches XXX/YYY price data
   * @param {string} symbol - The currency pair symbol
   * @returns {Promise<number>} The current price
   */
  async getPrice(symbol) {
    const response = await axiosInstance.get(`/api/prices/${symbol}`);
    return Number(response.data.price);
  },

  /**
   * Validates if a symbol is XXX/YYY type
   * @param {string} symbol - The symbol to check
   * @param {string} baseCurrency - Base currency code
   * @param {string} quoteCurrency - Quote currency code
   * @returns {boolean} True if XXX/YYY type
   */
  isXxxYyyPair(symbol, baseCurrency, quoteCurrency) {
    return (
      new RegExp(`^${baseCurrency}${quoteCurrency}$`).test(symbol) &&
      /^[A-Z]{3}[A-Z]{3}$/.test(symbol) &&
      !symbol.includes('USD') &&
      !symbol.includes('JPY')
    );
  }
};