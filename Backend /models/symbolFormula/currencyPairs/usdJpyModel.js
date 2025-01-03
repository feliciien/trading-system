/**
 * Immutable data structure for USD/JPY currency pair
 */
class UsdJpyPair {
    constructor(code, price) {
      Object.freeze({
        code,
        price: Number(price),
        formulaType: 'USD/JPY',
        timestamp: Date.now()
      });
    }
  
    static validate(price) {
      if (typeof price !== 'number' || price <= 0) {
        return false;
      }
      // Valid range for USD/JPY (80-200)
      return price >= 80 && price <= 200;
    }
  
    static create(code, price) {
      if (!this.validate(price)) {
        throw new Error('Invalid price data');
      }
      return new UsdJpyPair(code, price);
    }
  }
  
  module.exports = UsdJpyPair;