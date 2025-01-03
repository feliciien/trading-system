const CryptoUsdPair = require('../../../models/symbolFormula/crypto/cryptoUsdModel');

/**
 * Calculates the price for CRYPTO/USD pairs
 * @param {number} price - The input price to process
 * @returns {number} The calculated price
 * @throws {Error} If price is invalid or out of range
 */
const calculateCryptoUsdPrice = (price) => {
  if (!price || price <= 0) {
    throw new Error('Invalid price');
  }

  // Validate price range first
  CryptoUsdPair.validateRange(price);
  
  // Create immutable pair object
  const pair = CryptoUsdPair.create('CRYPTO/USD', price);
  
  // Round to 2 decimal places for crypto prices
  return Number(price.toFixed(2));
};

module.exports = {
  calculateCryptoUsdPrice
};