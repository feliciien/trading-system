const { calculateMetalsPrice } = require('../../control/symbolFormula/metalsController');

describe('Metals/USD Price Calculations', () => {
  it('should handle metals pricing directly', () => {
    const testCases = [
      { input: 1925.50, symbol: 'XAUUSD', expected: 1925.50 }, // Gold
      { input: 23.45, symbol: 'XAGUSD', expected: 23.45 },     // Silver
      { input: 75.30, symbol: 'OIL', expected: 75.30 },        // Oil
      { input: 2.85, symbol: 'NATGAS', expected: 2.85 }        // Natural Gas
    ];

    testCases.forEach(({ input, symbol, expected }) => {
      const result = calculateMetalsPrice(input, symbol);
      expect(result).toBe(expected);
    });
  });

  it('should validate metal price ranges', () => {
    const testCases = [
      { symbol: 'XAUUSD', price: 1925.50, valid: true },
      { symbol: 'XAUUSD', price: 500.00, valid: false },
      { symbol: 'XAGUSD', price: 23.45, valid: true },
      { symbol: 'OIL', price: 75.30, valid: true },
      { symbol: 'NATGAS', price: 2.85, valid: true }
    ];

    testCases.forEach(({ symbol, price, valid }) => {
      const result = calculateMetalsPrice.validatePrice(price, symbol);
      expect(result).toBe(valid);
    });
  });

  it('should maintain correct decimal places', () => {
    const result = calculateMetalsPrice(1925.506789, 'XAUUSD');
    expect(result.toString()).toMatch(/^\d+\.\d{2}$/);
  });

  it('should handle zero and negative inputs', () => {
    expect(() => calculateMetalsPrice(0, 'XAUUSD')).toThrow('Invalid metal price');
    expect(() => calculateMetalsPrice(-1, 'XAUUSD')).toThrow('Invalid metal price');
  });

  it('should throw error for unknown metal/commodity', () => {
    expect(() => calculateMetalsPrice(100.00, 'UNKNOWN'))
      .toThrow('Unknown metal/commodity');
  });
});