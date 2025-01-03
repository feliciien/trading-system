const MetalsPair = require('../../models/symbolFormula/metalsModel');

const calculateMetalsPrice = (price, symbol) => {
  if (!price || price <= 0) {
    throw new Error('Invalid metal price');
  }

  if (!MetalsPair.validate(price, symbol)) {
    throw new Error(`Unknown metal/commodity: ${symbol}`);
  }

  // Return price with 2 decimal places
  return Number(price.toFixed(2));
};

// Add validation function to the main function for testing
calculateMetalsPrice.validatePrice = (price, symbol) => {
  return MetalsPair.validate(price, symbol);
};

module.exports = {
  calculateMetalsPrice
};