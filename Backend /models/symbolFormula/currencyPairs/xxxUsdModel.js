/**
 * Immutable data structure for XXX/USD currency pairs
 */
class XxxUsdPair {
    constructor(code, price) {
      Object.freeze({
        code,
        price: Number(price),
        formulaType: 'XXX/USD',
        timestamp: Date.now()
      });
    }
  
    static validate(price) {
      return typeof price === 'number' && price >= 0;
    }
  
    static create(code, price) {
      if (!this.validate(price)) {
        throw new Error('Invalid price data');
      }
      return new XxxUsdPair(code, price);
    }
  }
  
  module.exports = XxxUsdPair;