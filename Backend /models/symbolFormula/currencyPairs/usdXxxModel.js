/**
 * Immutable data structure for USD/XXX currency pairs
 */
class UsdXxxPair {
    constructor(code, price) {
      Object.freeze({
        code,
        price: Number(price),
        formulaType: 'USD/XXX',
        timestamp: Date.now()
      });
    }
  
    static validate(price) {
      return typeof price === 'number' && price > 0;
    }
  
    static create(code, price) {
      if (!this.validate(price)) {
        throw new Error('Invalid price data');
      }
      return new UsdXxxPair(code, price);
    }
  }
  
  module.exports = UsdXxxPair;