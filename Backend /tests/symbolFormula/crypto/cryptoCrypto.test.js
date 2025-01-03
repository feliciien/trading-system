const { calculateCryptoCryptoPrice } = require('../../../control/symbolFormula/crypto/cryptoCryptoController');
const { Symbols } = require('../../../models');

// Mock the Symbols model
jest.mock('../../../models', () => ({
  Symbols: {
    findOne: jest.fn()
  }
}));

describe('CRYPTO/CRYPTO Price Calculations', () => {
  beforeEach(() => {
    // Mock crypto USD rates
    Symbols.findOne.mockImplementation(({ where }) => {
      const mockRates = {
        'BTCUSD': { currentPrice: 45000.00 },
        'ETHUSD': { currentPrice: 2250.00 }
      };
      return Promise.resolve(mockRates[where.code]);
    });
  });

  it('should calculate CRYPTO/CRYPTO price correctly', async () => {
    const testCases = [
      { 
        base: 'ETH',
        quote: 'BTC',
        input: 0.05,
        expected: 0.05 // ETHBTC = ETHUSD/BTCUSD = 2250/45000
      },
      {
        base: 'BTC',
        quote: 'ETH',
        input: 20,
        expected: 20 // BTCETH = BTCUSD/ETHUSD = 45000/2250
      }
    ];

    for (const { base, quote, input, expected } of testCases) {
      const result = await calculateCryptoCryptoPrice(input, base, quote);
      expect(result).toBeCloseTo(expected, 4);
    }
  });

  it('should throw error if USD rates are not available', async () => {
    Symbols.findOne.mockResolvedValue(null);
    await expect(calculateCryptoCryptoPrice(0.05, 'ETH', 'BTC'))
      .rejects.toThrow('USD rates not available');
  });

  it('should maintain precision to 8 decimal places', async () => {
    const result = await calculateCryptoCryptoPrice(0.05000123, 'ETH', 'BTC');
    expect(result.toString()).toMatch(/^\d+\.\d{8}$/);
  });

  it('should validate price ranges', async () => {
    await expect(calculateCryptoCryptoPrice(100, 'ETH', 'BTC'))
      .rejects.toThrow('Price out of range');
    await expect(calculateCryptoCryptoPrice(0, 'ETH', 'BTC'))
      .rejects.toThrow('Invalid price');
  });
});