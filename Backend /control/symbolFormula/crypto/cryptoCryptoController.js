const CryptoCryptoPair = require('../../../models/symbolFormula/crypto/cryptoCryptoModel');
const { Symbols } = require('../../../models');

/**
 * Gets USD rate for a crypto currency
 */
const getCryptoUsdRate = async (currency) => {
  const symbol = await Symbols.findOne({
    where: {
      code: `${currency}USD`,
      isActive: true
    },
    attributes: ['currentPrice']
  });
  return symbol ? symbol.currentPrice : null;
};

/**
 * Calculates the price for CRYPTO/CRYPTO pairs
 * @param {number} price - The input price to process
 * @param {string} baseCurrency - Base crypto currency
 * @param {string} quoteCurrency - Quote crypto currency
 * @returns {Promise<number>} The calculated price
 * @throws {Error} If price is invalid or rates unavailable
 */
const calculateCryptoCryptoPrice = async (price, baseCurrency, quoteCurrency) => {
  if (!price || price <= 0) {
    throw new Error('Invalid price');
  }

  // Get USD rates for both currencies
  const baseUsdRate = await getCryptoUsdRate(baseCurrency);
  const quoteUsdRate = await getCryptoUsdRate(quoteCurrency);

  if (!baseUsdRate || !quoteUsdRate) {
    throw new Error('USD rates not available');
  }

  // Create immutable pair object
  const pair = CryptoCryptoPair.create(baseCurrency, quoteCurrency, price);
  
  // Round to 8 decimal places for crypto pairs
  return Number(price.toFixed(8));
};

module.exports = {
  calculateCryptoCryptoPrice
};