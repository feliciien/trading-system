const TakeProfitModel = require('../models/TakeProfitModel');

class TakeProfitController {
  static verifyTakeProfit(position) {
    const { type, startPrice, currentPrice, takeProfit } = position;
    
    // Early return if no take profit is set
    if (!takeProfit || takeProfit <= 0) {
      return {
        shouldTrigger: false,
        profit: 0
      };
    }

    // Check if take profit is triggered (matches tradeController.checkTakeProfit logic)
    const shouldTrigger = type === 'Buy' 
      ? currentPrice >= takeProfit
      : currentPrice <= takeProfit;

    if (!shouldTrigger) {
      return {
        shouldTrigger: false,
        profit: 0
      };
    }

    // Calculate profit using the same logic as tradeController.calculatePnL
    const pipSize = 0.0001; // Standard for EURUSD
    const direction = type === 'Buy' ? 1 : -1;
    const priceDiff = (currentPrice - startPrice) * direction;
    const profit = (priceDiff / pipSize) * position.size * position.leverage;
    
    // Account for commission if present
    const finalProfit = profit - (position.commission || 0);
    
    return {
      shouldTrigger: true,
      profit: Number(finalProfit.toFixed(2))
    };
  }

  static async executeTakeProfit(position, currentPrice) {
    const takeProfitModel = new TakeProfitModel(position);
    const profit = takeProfitModel.calculateProfit(currentPrice);
    
    return {
      positionId: position.id,
      realizedProfit: profit,
      closePrice: currentPrice,
      closeReason: 'TakeProfit'
    };
  }
}

module.exports = TakeProfitController;