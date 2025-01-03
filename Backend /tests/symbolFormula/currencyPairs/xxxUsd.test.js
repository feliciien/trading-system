const { calculateXxxUsdPrice } = require('../../../control/symbolFormula/currencyPairs/xxxUsdController');

describe('XXX/USD Price Calculations', () => {
  it('should return direct price for XXX/USD pairs', () => {
    const testCases = [
      { input: 1.0795, expected: 1.0795 },
      { input: 1.2500, expected: 1.2500 },
      { input: 0.9263, expected: 0.9263 }
    ];

    testCases.forEach(({ input, expected }) => {
      const result = calculateXxxUsdPrice(input);
      expect(result).toBe(expected);
    });
  });

  it('should handle zero and negative inputs', () => {
    expect(calculateXxxUsdPrice(0)).toBe(0);
    expect(() => calculateXxxUsdPrice(-1)).toThrow('Invalid price');
  });

  it('should maintain precision to 4 decimal places', () => {
    const result = calculateXxxUsdPrice(1.07954321);
    expect(result).toBe(1.0795);
  });
});