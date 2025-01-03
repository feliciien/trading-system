const { calculateIndicesPrice } = require('../../control/symbolFormula/indicesController');

describe('Indices Price Calculations', () => {
  it('should handle index pricing directly', () => {
    const testCases = [
      { input: 35000.50, expected: 35000.50 }, // US30
      { input: 4780.25, expected: 4780.25 },   // SPX500
      { input: 16800.75, expected: 16800.75 }  // NAS100
    ];

    testCases.forEach(({ input, expected }) => {
      const result = calculateIndicesPrice(input);
      expect(result).toBe(expected);
    });
  });

  it('should validate index price ranges', () => {
    const testCases = [
      { symbol: 'US30', price: 35000.50, valid: true },
      { symbol: 'US30', price: 5000.00, valid: false },
      { symbol: 'SPX500', price: 4780.25, valid: true },
      { symbol: 'NAS100', price: 16800.75, valid: true }
    ];

    testCases.forEach(({ symbol, price, valid }) => {
      const result = calculateIndicesPrice.validatePrice(price, symbol);
      expect(result).toBe(valid);
    });
  });

  it('should maintain correct decimal places', () => {
    const result = calculateIndicesPrice(35000.506789);
    expect(result.toString()).toMatch(/^\d+\.\d{2}$/);
  });

  it('should handle zero and negative inputs', () => {
    expect(() => calculateIndicesPrice(0)).toThrow('Invalid index price');
    expect(() => calculateIndicesPrice(-1)).toThrow('Invalid index price');
  });
});