/**
 * Calculates the price for USD/XXX currency pairs
 * @param {number} price - The input price to process
 * @returns {number} The calculated inverse price
 * @throws {Error} If price is zero or negative
 */
const calculateUsdXxxPrice = (price) => {
    if (price <= 0) {
      throw new Error('Invalid price');
    }
    
    // Calculate inverse and round to 4 decimal places for forex standard
    return Number((1 / price).toFixed(4));
  };
  
  module.exports = {
    calculateUsdXxxPrice
  };