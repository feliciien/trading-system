const { calculateJpyXxxPrice } = require('../../../control/symbolFormula/currencyPairs/jpyXxxController');
const { Symbols } = require('../../../models');

// Mock the Symbols model
jest.mock('../../../models', () => ({
  Symbols: {
    findOne: jest.fn()
  }
}));

describe('JPY/XXX Price Calculations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock USD/JPY rate to 154.30
    Symbols.findOne.mockResolvedValue({
      currentPrice: 154.30
    });
  });

  it('should calculate JPY/XXX to USD price correctly', async () => {
    const testCases = [
      { input: 0.0062, expected: 1.05 },  // JPYEUR
      { input: 0.0071, expected: 1.20 },  // JPYGBP
      { input: 0.0065, expected: 1.10 }   // JPYCHF
    ];

    for (const { input, expected } of testCases) {
      const result = await calculateJpyXxxPrice(input);
      expect(result).toBeCloseTo(expected, 0);
    }
  });

  it('should handle zero and negative inputs', async () => {
    await expect(calculateJpyXxxPrice(0)).rejects.toThrow('Invalid price');
    await expect(calculateJpyXxxPrice(-1)).rejects.toThrow('Invalid price');
  });

  it('should maintain precision to 4 decimal places', async () => {
    const result = await calculateJpyXxxPrice(0.006234567);
    expect(result.toString()).toMatch(/^\d+\.\d{4}$/);
  });

  it('should throw error if USD/JPY rate is not available', async () => {
    Symbols.findOne.mockResolvedValue(null);
    await expect(calculateJpyXxxPrice(0.0062))
      .rejects.toThrow('USD/JPY rate not found');
  });
});