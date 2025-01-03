/**
 * Immutable data structure for XXX/YYY currency pairs
 */
class XxxYyyPair {
    constructor(code, price, baseUsdRate, quoteUsdRate) {
      Object.freeze({
        code,
        price: Number(price),
        baseUsdRate: Number(baseUsdRate),
        quoteUsdRate: Number(quoteUsdRate),
        formulaType: 'XXX/YYY',
        timestamp: Date.now()
      });
    }
  
    static validate(price, baseUsdRate, quoteUsdRate) {
      return (
        typeof price === 'number' && 
        typeof baseUsdRate === 'number' && 
        typeof quoteUsdRate === 'number' && 
        price > 0 && 
        baseUsdRate > 0 && 
        quoteUsdRate > 0
      );
    }
  
    static create(code, price, baseUsdRate, quoteUsdRate) {
      if (!this.validate(price, baseUsdRate, quoteUsdRate)) {
        throw new Error('Invalid price or USD rate data');
      }
      return new XxxYyyPair(code, price, baseUsdRate, quoteUsdRate);
    }
  }
  
  module.exports = XxxYyyPair;