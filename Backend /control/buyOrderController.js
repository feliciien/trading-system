const BuyOrderModel = require('../models/BuyOrderModel');

class BuyOrderController {
  static verifyBuyStop(order, currentPrice) {
    const buyOrder = new BuyOrderModel(order);
    const shouldTrigger = buyOrder.isBuyStopTriggered(currentPrice);
    
    return {
      shouldTrigger,
      executionPrice: shouldTrigger ? currentPrice : null
    };
  }

  static verifyBuyLimit(order, currentPrice) {
    const buyOrder = new BuyOrderModel(order);
    const shouldTrigger = buyOrder.isBuyLimitTriggered(currentPrice);
    
    return {
      shouldTrigger,
      executionPrice: shouldTrigger ? currentPrice : null
    };
  }

  static async executeBuyOrder(order, currentPrice) {
    const buyOrder = new BuyOrderModel(order);
    const isStopOrder = order.type === 'BuyStop';
    const shouldTrigger = isStopOrder 
      ? buyOrder.isBuyStopTriggered(currentPrice)
      : buyOrder.isBuyLimitTriggered(currentPrice);

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

module.exports = BuyOrderController;