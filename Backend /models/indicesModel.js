class IndicesPrice {
    constructor(price, symbol) {
      Object.freeze({
        price: Number(price),
        symbol: String(symbol),
        timestamp: Date.now()
      });
    }
  
    static create(price, symbol) {
      return new IndicesPrice(price, symbol);
    }
  
    static validate(price, symbol) {
      if (typeof price !== 'number' || price <= 0) {
        return false;
      }
      return true;
    }
  }
  
  module.exports = IndicesPrice;