/**
 * Calculates the price for XXX/USD currency pairs
 * @param {number} price - The input price to process
 * @returns {number} The calculated price
 * @throws {Error} If price is negative
 */
const calculateXxxUsdPrice = (price) => {
    if (price < 0) {
      throw new Error('Invalid price');
    }
    
    // Return price rounded to 4 decimal places for forex standard
    return Number(price.toFixed(4));
  };
  
  module.exports = {
    calculateXxxUsdPrice
  };