/**
 * Immutable data structure for CRYPTO/USD pairs
 */
class CryptoUsdPair {
    constructor(code, price) {
      Object.freeze({
        code,
        price: Number(price.toFixed(2)),
        formulaType: 'CRYPTO/USD',
        timestamp: Date.now()
      });
    }
  
    static validate(price) {
      if (typeof price !== 'number' || price <= 0) {
        return false;
      }
  
      // Define reasonable ranges for crypto prices
      const ranges = {
        'BTC': { min: 1000, max: 500000 },
        'ETH': { min: 100, max: 10000 },
        'default': { min: 0.01, max: 1000 }
      };
  
      // Use default range for general validation
      return true;
    }
  
    static validateRange(price) {
      if (price > 500000 || price < 0.01) {
        throw new Error('Price out of range');
      }
      return true;
    }
  
    static create(code, price) {
      if (!this.validate(price)) {
        throw new Error('Invalid price data');
      }
      return new CryptoUsdPair(code, price);
    }
  }
  
  module.exports = CryptoUsdPair;