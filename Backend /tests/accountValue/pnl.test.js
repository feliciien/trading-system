const { calculatePnL, calculateUnrealizedPnL } = require('../../control/pnlController');
const { createPosition } = require('../../models/pnlModel');

describe('PnL Calculations', () => {
  test('should calculate profit correctly for long position', () => {
    const position = createPosition({
      type: 'Buy',
      size: 1000,
      startPrice: 1.1000,
      currentPrice: 1.1050,
      leverage: 100,
      pipSize: 0.0001,
      commission: 2.50
    });
    
    const result = calculatePnL(position);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10000000);
    expect(Number.isFinite(result)).toBe(true);
  });

  test('should calculate loss correctly for short position', () => {
    const position = createPosition({
      type: 'Sell',
      size: 1000,
      startPrice: 1.1000,
      currentPrice: 1.1050,
      leverage: 100,
      pipSize: 0.0001,
      commission: 2.50
    });
    
    const result = calculatePnL(position);
    expect(result).toBeLessThan(0);
    expect(result).toBeGreaterThan(-10000000);
    expect(Number.isFinite(result)).toBe(true);
  });

  test('should handle missing or invalid inputs gracefully', () => {
    expect(calculatePnL(null)).toBe(0);
    expect(calculatePnL({})).toBe(0);
    expect(calculateUnrealizedPnL(null)).toBe(0);
  });
});