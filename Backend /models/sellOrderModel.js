class SellOrderModel {
    constructor(orderData) {
      this.type = orderData.type;
      this.stopPrice = orderData.stopPrice;
      this.limitPrice = orderData.limitPrice;
      this.size = orderData.size;
      this.leverage = orderData.leverage;
      this.symbolName = orderData.symbolName;
    }
  
    isSellStopTriggered(currentPrice) {
      return currentPrice <= this.stopPrice;
    }
  
    isSellLimitTriggered(currentPrice) {
      return currentPrice >= this.limitPrice;
    }
  
    toJSON() {
      return {
        type: this.type,
        stopPrice: this.stopPrice,
        limitPrice: this.limitPrice,
        size: this.size,
        leverage: this.leverage,
        symbolName: this.symbolName
      };
    }
  }
  
  module.exports = SellOrderModel;