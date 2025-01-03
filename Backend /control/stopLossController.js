const StopLossModel = require('../models/StopLossModel');
const Position = require('../models/positions');

class StopLossController {
  static checkStopLoss(position, currentPrice) {
    const stopLoss = new StopLossModel(position, position.stopLoss);
    return stopLoss.isTriggered(currentPrice);
  }

  static async executeStopLoss(position, currentPrice, user) {
    const stopLoss = new StopLossModel(position, position.stopLoss);
    const loss = stopLoss.calculateLoss();
    
    return {
      positionId: position.id,
      realizedLoss: loss,
      closePrice: currentPrice,
      closeReason: 'StopLoss'
    };
  }

  static verifyStopLoss(position) {
    const { type, startPrice, currentPrice, stopLoss } = position;
    
    // Calculate pip difference (1 pip = 0.0001 for EURUSD)
    const pipSize = 0.0001;
    const priceDiff = Math.abs(currentPrice - startPrice) / pipSize;
    
    // Determine if the position is at a loss
    let isLoss;
    if (type === 'Buy') {
      isLoss = currentPrice < startPrice;
    } else { // Sell position
      isLoss = currentPrice > startPrice;
    }
    
    // Calculate actual loss in pips
    const actualLoss = isLoss ? priceDiff : 0;
    
    // Stop loss trigger condition
    const shouldTrigger = stopLoss > 0 && actualLoss >= stopLoss;
    
    return {
      shouldTrigger,
      loss: isLoss ? -actualLoss : 0
    };
  }
}

module.exports = StopLossController;