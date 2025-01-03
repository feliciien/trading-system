class StopLossModel {
    constructor(position, stopLossPrice) {
      this.positionId = position.id;
      this.entryPrice = position.startPrice;
      this.stopLossPrice = stopLossPrice;
      this.type = position.type; // 'Buy' or 'Sell'
    }
  
    isTriggered(currentPrice) {
      if (this.type === 'Buy') {
        return currentPrice <= this.stopLossPrice;
      }
      return currentPrice >= this.stopLossPrice;
    }
  
    calculateLoss() {
      const priceDiff = Math.abs(this.entryPrice - this.stopLossPrice);
      return priceDiff;
    }
  
    toJSON() {
      return {
        positionId: this.positionId,
        stopLossPrice: this.stopLossPrice,
        entryPrice: this.entryPrice,
        type: this.type
      };
    }
  }
  
  module.exports = StopLossModel;