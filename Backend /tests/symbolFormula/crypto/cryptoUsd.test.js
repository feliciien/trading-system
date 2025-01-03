const { calculateCryptoUsdPrice } = require('../../../control/symbolFormula/crypto/cryptoUsdController');

describe('CRYPTO/USD Price Calculations', () => {
  it('should return direct price for CRYPTO/USD pairs', () => {
    const testCases = [
      { input: 45000.00, expected: 45000.00 }, // BTC/USD
      { input: 2250.00, expected: 2250.00 },   // ETH/USD
      { input: 1.50, expected: 1.50 }          // XRP/USD
    ];

    testCases.forEach(({ input, expected }) => {
      const result = calculateCryptoUsdPrice(input);
      expect(result).toBe(expected);
    });
  });

  it('should handle zero and negative inputs', () => {
    expect(() => calculateCryptoUsdPrice(0)).toThrow('Invalid price');
    expect(() => calculateCryptoUsdPrice(-1)).toThrow('Invalid price');
  });

  it('should maintain precision to 2 decimal places', () => {
    const result = calculateCryptoUsdPrice(45000.123456);
    expect(result).toBe(45000.12);
  });

  it('should validate price ranges', () => {
    expect(() => calculateCryptoUsdPrice(1000000.00)).toThrow('Price out of range');
    expect(() => calculateCryptoUsdPrice(0.000001)).toThrow('Price out of range');
  });
});