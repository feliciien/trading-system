const { calculateUsdJpyPrice } = require('../../../control/symbolFormula/currencyPairs/usdJpyController');

describe('USD/JPY Price Calculations', () => {
  it('should handle direct price pass-through', () => {
    const testCases = [
      { input: 154.30, expected: 154.30 },
      { input: 151.50, expected: 151.50 },
      { input: 148.75, expected: 148.75 }
    ];

    testCases.forEach(({ input, expected }) => {
      const result = calculateUsdJpyPrice(input);
      expect(result).toBeCloseTo(expected, 1);
    });
  });

  it('should handle zero and negative inputs', () => {
    expect(() => calculateUsdJpyPrice(0)).toThrow('Invalid price');
    expect(() => calculateUsdJpyPrice(-1)).toThrow('Invalid price');
  });

  it('should maintain reasonable precision', () => {
    const result = calculateUsdJpyPrice(154.305);
    expect(result).toBeCloseTo(154.31, 1);
  });

  it('should accept reasonable price ranges', () => {
    const testCases = [50, 100, 150, 200];
    testCases.forEach(price => {
      expect(() => calculateUsdJpyPrice(price)).not.toThrow();
    });
  });
});