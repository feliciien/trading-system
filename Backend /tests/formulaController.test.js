const formulaController = require('../control/formulaController');
const { Symbols } = require('../models');

// Mock the Symbols model
jest.mock('../models', () => ({
  Symbols: {
    findOne: jest.fn()
  }
}));

describe('Formula Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Symbol Price Calculations', () => {
    it('should calculate XXX/USD price correctly', async () => {
      const symbol = {
        code: 'EURUSD',
        formulaType: 'XXX/USD',
        baseCurrency: 'EUR',
        quoteCurrency: 'USD'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 1.0795);
      expect(result).toBe(1.0795);
    });

    it('should calculate USD/XXX price correctly', async () => {
      const symbol = {
        code: 'USDEUR',
        formulaType: 'USD/XXX',
        baseCurrency: 'USD',
        quoteCurrency: 'EUR'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 0.9263);
      expect(result).toBeCloseTo(1.0795, 4); // 1/0.9263
    });

    it('should throw error for invalid formula type', async () => {
      const symbol = {
        code: 'INVALID',
        formulaType: 'INVALID'
      };
      
      await expect(
        formulaController.calculateSymbolPrice(symbol, 1.0000)
      ).rejects.toThrow('Invalid formula type');
    });
  });

  describe('JPY Pair Calculations', () => {
    beforeEach(() => {
      // Mock USD/JPY rate to 154.30
      Symbols.findOne.mockResolvedValue({
        currentPrice: 154.30
      });
    });

    it('should handle USD/JPY price correctly', async () => {
      const symbol = {
        code: 'USDJPY',
        formulaType: 'USD/JPY',
        baseCurrency: 'USD',
        quoteCurrency: 'JPY'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 154.30);
      expect(result).toBe(154.30);
    });

    it('should convert JPY/XXX to USD correctly', async () => {
      const symbol = {
        formulaType: 'JPY/XXX'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 0.0062);
      expect(result).toBeCloseTo(1.05, 1);
    });

    it('should handle XXX/JPY conversion correctly', async () => {
      const symbol = {
        formulaType: 'XXX/JPY'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 162.50);
      expect(result).toBeCloseTo(1.05, 1);
    });

    it('should throw error if USD/JPY rate is not available', async () => {
      Symbols.findOne.mockResolvedValue(null);
      
      const symbol = {
        code: 'JPYEUR',
        formulaType: 'JPY/XXX'
      };
      
      await expect(
        formulaController.calculateSymbolPrice(symbol, 0.0062)
      ).rejects.toThrow('USD/JPY rate not found');
    });
  });

  describe('Cross Rate Calculations', () => {
    beforeEach(() => {
      // Mock USD rates
      Symbols.findOne
        .mockImplementation(({ where }) => {
          const mockRates = {
            'EURUSD': { currentPrice: 1.1000 },
            'GBPUSD': { currentPrice: 1.2500 },
            'USDJPY': { currentPrice: 154.30 }
          };
          return Promise.resolve(mockRates[where.code]);
        });
    });

    it('should calculate XXX/YYY cross rate correctly', async () => {
      const symbol = {
        code: 'EURGBP',
        formulaType: 'XXX/YYY',
        baseCurrency: 'EUR',
        quoteCurrency: 'GBP'
      };
      
      // EUR/GBP should be EUR/USD divided by GBP/USD
      // 1.1000 / 1.2500 = 0.8800
      const result = await formulaController.calculateSymbolPrice(symbol, 1.0000);
      expect(result).toBeCloseTo(0.8800, 4);
    });

    it('should handle inverse USD pairs in cross rate calculation', async () => {
      const symbol = {
        code: 'GBPEUR',
        formulaType: 'XXX/YYY',
        baseCurrency: 'GBP',
        quoteCurrency: 'EUR'
      };
      
      // GBP/EUR should be GBP/USD divided by EUR/USD
      // 1.2500 / 1.1000 = 1.1364
      const result = await formulaController.calculateSymbolPrice(symbol, 1.0000);
      expect(result).toBeCloseTo(1.1364, 4);
    });

    it('should throw error if USD rates are not available', async () => {
      Symbols.findOne.mockResolvedValue(null);
      
      const symbol = {
        code: 'EURGBP',
        formulaType: 'XXX/YYY',
        baseCurrency: 'EUR',
        quoteCurrency: 'GBP'
      };
      
      await expect(
        formulaController.calculateSymbolPrice(symbol, 1.0000)
      ).rejects.toThrow('USD rates not available');
    });
  });

  describe('Index and Crypto Calculations', () => {
    beforeEach(() => {
      // Mock crypto rates
      Symbols.findOne.mockImplementation(({ where }) => {
        const mockRates = {
          'BTCUSD': { currentPrice: 45000.00 },
          'ETHUSD': { currentPrice: 2250.00 }
        };
        return Promise.resolve(mockRates[where.code]);
      });
    });

    it('should handle index pricing directly', async () => {
      const symbol = {
        code: 'US30',
        formulaType: 'INDEX',
        assetName: 'Indices'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 35000.50);
      expect(result).toBe(35000.50);
    });

    it('should handle CRYPTO/USD pricing directly', async () => {
      const symbol = {
        code: 'BTCUSD',
        formulaType: 'CRYPTO/USD',
        baseCurrency: 'BTC',
        quoteCurrency: 'USD'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 45000.00);
      expect(result).toBe(45000.00);
    });

    it('should calculate CRYPTO/CRYPTO price correctly', async () => {
      const symbol = {
        code: 'ETHBTC',
        formulaType: 'CRYPTO/CRYPTO',
        baseCurrency: 'ETH',
        quoteCurrency: 'BTC'
      };
      
      // ETHBTC should be ETHUSD/BTCUSD
      // 2250.00/45000.00 = 0.05
      const result = await formulaController.calculateSymbolPrice(symbol, 0.05);
      expect(result).toBeCloseTo(0.05, 4);
    });
  });

  describe('Metals and Commodities Calculations', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle gold (XAU/USD) pricing correctly', async () => {
      const symbol = {
        code: 'XAUUSD',
        formulaType: 'METALS/USD',
        assetName: 'Futures',
        name: 'Gold'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 1925.50);
      expect(result).toBe(1925.50);
    });

    it('should handle silver (XAG/USD) pricing correctly', async () => {
      const symbol = {
        code: 'XAGUSD',
        formulaType: 'METALS/USD',
        assetName: 'Futures',
        name: 'Silver'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 23.45);
      expect(result).toBe(23.45);
    });

    it('should handle oil pricing correctly', async () => {
      const symbol = {
        code: 'OIL',
        formulaType: 'METALS/USD',
        assetName: 'Futures',
        name: 'Oil'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 75.30);
      expect(result).toBe(75.30);
    });

    it('should handle natural gas pricing correctly', async () => {
      const symbol = {
        code: 'NATGAS',
        formulaType: 'METALS/USD',
        assetName: 'Futures',
        name: 'Gas'
      };
      
      const result = await formulaController.calculateSymbolPrice(symbol, 2.85);
      expect(result).toBe(2.85);
    });

    it('should validate metal prices within expected ranges', () => {
      const validGold = formulaController.validateMetalPrice(1925.50, { code: 'XAUUSD' });
      expect(validGold).toBe(true);

      const validSilver = formulaController.validateMetalPrice(23.45, { code: 'XAGUSD' });
      expect(validSilver).toBe(true);

      const invalidGold = formulaController.validateMetalPrice(500, { code: 'XAUUSD' });
      expect(invalidGold).toBe(false);
    });

    it('should throw error for unknown metal/commodity', async () => {
      const symbol = {
        code: 'UNKNOWN',
        formulaType: 'METALS/USD',
        assetName: 'Futures'
      };
      
      await expect(
        formulaController.calculateSymbolPrice(symbol, 100.00)
      ).rejects.toThrow('Unknown metal/commodity');
    });
  });
});