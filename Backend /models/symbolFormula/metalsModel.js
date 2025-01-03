/**
 * Immutable data structure for Metals/USD pairs
 */
class MetalsPair {
    constructor(code, price) {
      Object.freeze({
        code,
        price: Number(price),
        formulaType: 'METALS/USD',
        timestamp: Date.now()
      });
    }
  
    static validate(price, code) {
      const limits = {
        'XAUUSD': { min: 1000, max: 3000 },
        'XAGUSD': { min: 10, max: 50 },
        'NATGAS': { min: 1, max: 10 },
        'OIL': { min: 20, max: 150 }
      };
  
      if (!limits[code]) return false;
      const range = limits[code];
      return typeof price === 'number' && 
             price > 0 && 
             price >= range.min && 
             price <= range.max;
    }
  
    static create(code, price) {
      if (!this.validate(price, code)) {
        throw new Error('Invalid price data');
      }
      return new MetalsPair(code, price);
    }
  }
  
  module.exports = MetalsPair;