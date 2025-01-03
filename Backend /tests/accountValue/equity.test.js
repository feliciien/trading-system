const { updateEquity } = require('../../control/equityController');

describe('Equity Updates', () => {
  test('should calculate equity correctly with no positions', () => {
    const mockUser = {
      balance: 1000,
      positions: []
    };
    expect(updateEquity(mockUser)).toBe(1000);
  });

  test('should calculate equity with unrealized PnL', () => {
    const mockPositions = [{
      size: 1000,
      type: 'Buy',
      startPrice: 1.1000,
      currentPrice: 1.1050,
      leverage: 100,
      commission: 2.50,
      pipSize: 0.0001
    }];
    
    const mockUser = {
      balance: 1000,
      positions: mockPositions
    };

    // Expected equity = balance + unrealized PnL - commission
    // PnL = (currentPrice - startPrice) * size * leverage / pipSize
    const expectedEquity = 1000 + ((1.1050 - 1.1000) / 0.0001 * 1000 * 100) - 2.50;
    
    expect(updateEquity(mockUser)).toBeCloseTo(expectedEquity, 2);
  });
});