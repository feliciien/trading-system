/**
 * Immutable data structure for CRYPTO/CRYPTO pairs
 */
class CryptoCryptoPair {
    constructor(baseCode, quoteCode, price) {
      Object.freeze({
        baseCode,
        quoteCode,
        price: Number(price.toFixed(8)),
        formulaType: 'CRYPTO/CRYPTO',
        timestamp: Date.now()
      });
    }
  
    static validate(price, baseCode, quoteCode) {
      if (typeof price !== 'number' || price <= 0) {
        throw new Error('Invalid price');
      }
  
      // Define reasonable ranges for crypto/crypto pairs
      const ranges = {
        'BTC': { min: 0.001, max: 50 },    // For pairs against BTC
        'ETH': { min: 0.01, max: 100 },    // For pairs against ETH
        'default': { min: 0.00000001, max: 1000 }
      };
  
      const range = ranges[quoteCode] || ranges.default;
      if (price < range.min || price > range.max) {
        throw new Error('Price out of range');
      }
  
      return true;
    }
  
    static create(baseCode, quoteCode, price) {
      this.validate(price, baseCode, quoteCode);
      return new CryptoCryptoPair(baseCode, quoteCode, price);
    }
  }
  
  module.exports = CryptoCryptoPair;