const { verifyStopLoss } = require('../../control/stopLossController');
const Position = require('../../models/positions');

describe('Stop Loss Execution Tests', () => {
  test('should trigger stop loss for long position', () => {
    const position = {
      type: 'Buy',
      startPrice: 1.1000,
      size: 1000,
      leverage: 100,
      stopLoss: 50,
      currentPrice: 1.0950
    };
    
    const result = verifyStopLoss(position);
    expect(result.shouldTrigger).toBe(true);
    expect(result.loss).toBeCloseTo(-50, 2);
  });

  test('should trigger stop loss for short position', () => {
    const position = {
      type: 'Sell',
      startPrice: 1.1000,
      size: 1000,
      leverage: 100,
      stopLoss: 50,
      currentPrice: 1.1050
    };
    
    const result = verifyStopLoss(position);
    expect(result.loss).toBeLessThan(0);
  });

  test('should not trigger stop loss when price is favorable', () => {
    const position = {
      type: 'Buy',
      startPrice: 1.1000,
      size: 1000,
      leverage: 100,
      stopLoss: 50,
      currentPrice: 1.1050
    };
    
    const result = verifyStopLoss(position);
    expect(result.shouldTrigger).toBe(false);
  });
});