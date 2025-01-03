const SellOrderModel = require('../models/sellOrderModel');

class SellOrderController {
  static verifySellStop(order, currentPrice) {
    const sellOrder = new SellOrderModel(order);
    const shouldTrigger = sellOrder.isSellStopTriggered(currentPrice);
    
    return {
      shouldTrigger,
      executionPrice: shouldTrigger ? currentPrice : null
    };
  }

  static verifySellLimit(order, currentPrice) {
    const sellOrder = new SellOrderModel(order);
    const shouldTrigger = sellOrder.isSellLimitTriggered(currentPrice);
    
    return {
      shouldTrigger,
      executionPrice: shouldTrigger ? currentPrice : null
    };
  }

  static async executeSellOrder(order, currentPrice) {
    const sellOrder = new SellOrderModel(order);
    const isStopOrder = order.type === 'SellStop';
    const shouldTrigger = isStopOrder 
      ? sellOrder.isSellStopTriggered(currentPrice)
      : sellOrder.isSellLimitTriggered(currentPrice);

    if (!shouldTrigger) {
      return null;
    }

    return {
      type: order.type,
      executionPrice: currentPrice,
      size: order.size,
      leverage: order.leverage,
      symbolName: order.symbolName
    };
  }
}

module.exports = SellOrderController;