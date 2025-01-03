const UsdJpyPair = require('../../../models/symbolFormula/currencyPairs/usdJpyModel');

/**
 * Calculates the price for USD/JPY currency pairs
 * @param {number} price - The input price to process
 * @returns {number} The calculated price
 * @throws {Error} If price is zero or negative
 * @todo Add stricter price range validation in future iteration
 */
const calculateUsdJpyPrice = (price) => {
  if (!price || price <= 0) {
    throw new Error('Invalid price');
  }
  
  // Round to 2 decimal places for JPY pairs
  return Number(price.toFixed(2));
};

module.exports = {
  calculateUsdJpyPrice
};