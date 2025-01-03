const { calculateXxxYyyPrice } = require('../../../control/symbolFormula/currencyPairs/xxxYyyController');
const { Symbols } = require('../../../models');

// Mock the Symbols model
jest.mock('../../../models', () => ({
  Symbols: {
    findOne: jest.fn()
  }
}));

describe('XXX/YYY Price Calculations', () => {
  beforeEach(() => {
    // Mock USD rates
    Symbols.findOne.mockImplementation(({ where }) => {
      const mockRates = {
        'EURUSD': { currentPrice: 1.1000 },
        'GBPUSD': { currentPrice: 1.2500 }
      };
      return Promise.resolve(mockRates[where.code]);
    });
  });

  it('should calculate XXX/YYY cross rate correctly', async () => {
    const testCases = [
      { 
        base: 'EUR',
        quote: 'GBP',
        input: 0.8800,
        expected: 0.8800 // EUR/GBP = (EUR/USD)/(GBP/USD) = 1.1000/1.2500
      },
      {
        base: 'GBP',
        quote: 'EUR',
        input: 1.1364,
        expected: 1.1364 // GBP/EUR = (GBP/USD)/(EUR/USD) = 1.2500/1.1000
      }
    ];

    for (const { base, quote, input, expected } of testCases) {
      const result = await calculateXxxYyyPrice(input, base, quote);
      expect(result).toBeCloseTo(expected, 0);
    }
  });

  it('should throw error if USD rates are not available', async () => {
    Symbols.findOne.mockResolvedValue(null);
    await expect(calculateXxxYyyPrice(0.8800, 'EUR', 'GBP'))
      .rejects.toThrow('USD rates not available');
  });

  it('should maintain precision to 4 decimal places', async () => {
    const result = await calculateXxxYyyPrice(0.88004321, 'EUR', 'GBP');
    expect(result.toString()).toMatch(/^\d+\.\d{4}$/);
  });
});