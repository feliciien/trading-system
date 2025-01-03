const { Symbols } = require('../../../models');
const XxxYyyPair = require('../../../models/symbolFormula/currencyPairs/xxxYyyModel');

/**
 * Fetches USD rate for a currency
 * @param {string} currency - The currency code
 * @returns {Promise<number>} The USD rate
 * @throws {Error} If rate is not available
 */
const getUsdRate = async (currency) => {
  if (currency === 'USD') return 1;
  
  const symbol = await Symbols.findOne({
    where: { code: `${currency}USD`, isActive: true },
    attributes: ['currentPrice']
  });
  
  if (symbol) return symbol.currentPrice;
  
  const inverseSymbol = await Symbols.findOne({
    where: { code: `USD${currency}`, isActive: true },
    attributes: ['currentPrice']
  });
  
  return inverseSymbol ? 1 / inverseSymbol.currentPrice : null;
};

/**
 * Calculates the price for XXX/YYY currency pairs
 * @param {number} price - The input price
 * @param {string} baseCurrency - The base currency
 * @param {string} quoteCurrency - The quote currency
 * @returns {Promise<number>} The calculated price
 * @throws {Error} If USD rates are not available
 */
const calculateXxxYyyPrice = async (price, baseCurrency, quoteCurrency) => {
  const baseUsdRate = await getUsdRate(baseCurrency);
  const quoteUsdRate = await getUsdRate(quoteCurrency);
  
  if (!baseUsdRate || !quoteUsdRate) {
    throw new Error('USD rates not available');
  }
  
  const pair = XxxYyyPair.create(
    `${baseCurrency}${quoteCurrency}`,
    price,
    baseUsdRate,
    quoteUsdRate
  );
  
  // Calculate cross rate and multiply by input price
  return Number(((baseUsdRate / quoteUsdRate) * price).toFixed(4));
};

module.exports = {
  calculateXxxYyyPrice,
  getUsdRate
};