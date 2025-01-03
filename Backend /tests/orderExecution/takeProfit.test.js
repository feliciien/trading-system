const { verifyTakeProfit } = require('../../control/takeProfitController');
const Position = require('../../models/positions');

describe('Take Profit Execution Tests', () => {
  test('should trigger take profit for long position', () => {
    const position = {
      type: 'Buy',
      startPrice: 1.1000,
      size: 1000,
      leverage: 100,
      takeProfit: 1.1050,
      currentPrice: 1.1060
    };
    
    const result = verifyTakeProfit(position);
    expect(result.shouldTrigger).toBe(true);
  });

  test('should trigger take profit for short position', () => {
    const position = {
      type: 'Sell',
      startPrice: 1.1000,
      size: 1000,
      leverage: 100,
      takeProfit: 1.0950,
      currentPrice: 1.0940
    };
    
    const result = verifyTakeProfit(position);
    expect(result.shouldTrigger).toBe(true);
  });

  test('should not trigger take profit when price is unfavorable', () => {
    const position = {
      type: 'Buy',
      startPrice: 1.1000,
      size: 1000,
      leverage: 100,
      takeProfit: 1.1050,
      currentPrice: 1.0950
    };
    
    const result = verifyTakeProfit(position);
    expect(result.shouldTrigger).toBe(false);
  });

  test('should handle missing take profit value', () => {
    const position = {
      type: 'Buy',
      startPrice: 1.1000,
      size: 1000,
      leverage: 100,
      currentPrice: 1.1050
    };
    
    const result = verifyTakeProfit(position);
    expect(result.shouldTrigger).toBe(false);
  });
});