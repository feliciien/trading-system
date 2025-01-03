class TakeProfitModel {
    constructor(position) {
      this.position = position;
      this.pipSize = 0.0001; // Standard pip size for EURUSD
    }
  
    isTriggered(currentPrice) {
      if (!this.position.takeProfit || this.position.takeProfit <= 0) {
        return false;
      }
      
      const priceDiff = Math.abs(currentPrice - this.position.startPrice) / this.pipSize;
      
      if (this.position.type === 'Buy') {
        return currentPrice > this.position.startPrice && priceDiff >= this.position.takeProfit;
      } else {
        return currentPrice < this.position.startPrice && priceDiff >= this.position.takeProfit;
      }
    }
  
    calculateProfit(currentPrice) {
      if (!currentPrice) return 0;
      
      const priceDiff = (currentPrice - this.position.startPrice) / this.pipSize;
      const profit = priceDiff * this.position.size * this.position.leverage;
      
      return this.position.type === 'Buy' ? profit : -profit;
    }
  }
  
  module.exports = TakeProfitModel;