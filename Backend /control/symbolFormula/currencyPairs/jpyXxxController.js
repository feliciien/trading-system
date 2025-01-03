const { Symbols } = require('../../../models');
const JpyXxxPair = require('../../../models/symbolFormula/currencyPairs/jpyXxxModel');

/**
 * Fetches current USD/JPY rate
 * @returns {Promise<number>} The current USD/JPY rate
 * @throws {Error} If rate is not available
 */
const getUsdJpyRate = async () => {
  const usdJpy = await Symbols.findOne({
    where: { code: 'USDJPY', isActive: true },
    attributes: ['currentPrice']
  });
  
  if (!usdJpy) {
    throw new Error('USD/JPY rate not found');
  }
  
  return usdJpy.currentPrice;
};

/**
 * Calculates the USD price for JPY/XXX currency pairs
 * @param {number} price - The input price to process
 * @returns {Promise<number>} The calculated USD price
 * @throws {Error} If price is invalid or USD/JPY rate is unavailable
 */
const calculateJpyXxxPrice = async (price) => {
  if (!price || price <= 0) {
    throw new Error('Invalid price');
  }

  const usdJpyRate = await getUsdJpyRate();
  
  // Convert JPY/XXX to XXX/JPY
  const jpyXxxRate = 1 / price;
  
  // Convert XXX/JPY to USD/XXX by dividing by USD/JPY rate
  const usdPrice = jpyXxxRate / usdJpyRate;
  
  // Return price rounded to 4 decimal places
  return Number(usdPrice.toFixed(4));
};

module.exports = {
  calculateJpyXxxPrice,
  getUsdJpyRate
};