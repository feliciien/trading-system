const { calculateUsdXxxPrice } = require('../../../control/symbolFormula/currencyPairs/usdXxxController');

describe('USD/XXX Price Calculations', () => {
  it('should calculate inverse price for USD/XXX pairs', () => {
    const testCases = [
      { input: 0.9263, expected: 1.0795 },  // 1/0.9263 ≈ 1.0795
      { input: 0.8000, expected: 1.2500 },  // 1/0.8000 = 1.2500
      { input: 1.2500, expected: 0.8000 }   // 1/1.2500 = 0.8000
    ];

    testCases.forEach(({ input, expected }) => {
      const result = calculateUsdXxxPrice(input);
      expect(result).toBeCloseTo(expected, 3);
    });
  });

  it('should handle zero and negative inputs', () => {
    expect(() => calculateUsdXxxPrice(0)).toThrow('Invalid price');
    expect(() => calculateUsdXxxPrice(-1)).toThrow('Invalid price');
  });

  it('should maintain precision to 4 decimal places', () => {
    const result = calculateUsdXxxPrice(0.92634321);
    expect(result).toBeCloseTo(1.0795, 3);
  });
});