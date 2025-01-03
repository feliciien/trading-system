/**
 * Immutable data structure for JPY/XXX currency pairs
 */
class JpyXxxPair {
    constructor(code, price, usdJpyRate) {
      Object.freeze({
        code,
        price: Number(price),
        usdJpyRate: Number(usdJpyRate),
        formulaType: 'JPY/XXX',
        timestamp: Date.now()
      });
    }
  
    static validate(price, usdJpyRate) {
      return (
        typeof price === 'number' && 
        typeof usdJpyRate === 'number' && 
        price > 0 && 
        usdJpyRate > 0
      );
    }
  
    static create(code, price, usdJpyRate) {
      if (!this.validate(price, usdJpyRate)) {
        throw new Error('Invalid price or USD/JPY rate');
      }
      return new JpyXxxPair(code, price, usdJpyRate);
    }
  }
  
  module.exports = JpyXxxPair;