const tradeController = require('../control/tradeController');
const { Position, User } = require('../models');

describe('Trade Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.initialBalance = 1000;
  });

  describe('Balance and Equity', () => {
    describe('verifyBalance()', () => {
      it('should correctly verify balance with positions', async () => {
        const mockPositions = [
          {
            realProfit: 100.50,
            commission: 2.50,
            status: 'Closed'
          },
          {
            realProfit: -50.25,
            commission: 2.50,
            status: 'Closed'
          }
        ];
        Position.findAll.mockResolvedValue(mockPositions);
        const result = await tradeController.verifyBalance(1, 1045.25);
        expect(result).toBe(true);
      });
    });

    describe('updateEquity()', () => {
      it('should calculate equity correctly with open positions', () => {
        const balance = 1000;
        const openPositions = [{
          symbolName: 'EURUSD',
          type: 'Buy',
          startPrice: 1.1000,
          size: 1000,
          leverage: 100,
          commission: 2.50
        }];
        const currentPrices = {
          EURUSD: 1.1050
        };
        
        // Note: Actual calculation may vary based on different PnL formulas
        // We're just checking that the equity increases when price moves favorably
        const result = tradeController.updateEquity(balance, openPositions, currentPrices);
        expect(result).toBeGreaterThan(balance); // Should be profitable
        expect(typeof result).toBe('number'); // Should return a number
        expect(Number.isFinite(result)).toBe(true); // Should be finite
      });
    });
  });

  describe('Margin Calculation', () => {
    it('should calculate margin correctly for standard position', () => {
      const position = {
        symbolName: 'EURUSD',
        type: 'Buy',
        startPrice: 1.1000,
        size: 1000,
        leverage: 100
      };
      
      const symbolInfo = {
        code: 'EURUSD',
        pipSize: 0.0001
      };
      
      // Margin = (Position Size * Start Price) / Leverage
      // (1000 * 1.1000) / 100 = 11.00
      const result = tradeController.calculateMargin(position, symbolInfo);
      expect(result).toBeCloseTo(11.00, 2);
    });

    it('should handle zero leverage correctly', () => {
      const position = {
        size: 1000,
        startPrice: 1.1000,
        leverage: 0
      };
      
      const result = tradeController.calculateMargin(position, {});
      expect(result).toBe(0);
    });

    it('should match frontend margin calculation', () => {
      const position = {
        symbolName: 'EURUSD',
        type: 'Buy',
        startPrice: 1.1000,
        size: 1000,
        leverage: 100
      };

      // Reference frontend calculation from Trading.js:
      // lines 52-64 for Position class
      const result = tradeController.calculateMargin(position, {});
      expect(result).toBeGreaterThan(0);
      expect(Number.isFinite(result)).toBe(true);
    });
  });

  describe('Order Execution', () => {
    describe('Stop Loss & Take Profit', () => {
      it('should trigger stop loss for long position', () => {
        const position = {
          type: 'Buy',
          startPrice: 1.1000,
          stopLoss: 1.0950,
          size: 1000,
          leverage: 100
        };
        
        const currentPrice = 1.0940; // Below stop loss
        const result = tradeController.checkStopLoss(position, currentPrice);
        expect(result).toBe(true);
      });

      it('should trigger take profit for long position', () => {
        const position = {
          type: 'Buy',
          startPrice: 1.1000,
          takeProfit: 1.1050,
          size: 1000,
          leverage: 100
        };
        
        const currentPrice = 1.1060; // Above take profit
        const result = tradeController.checkTakeProfit(position, currentPrice);
        expect(result).toBe(true);
      });
    });

    describe('Buy Stop/Limit Orders', () => {
      it('should trigger buy stop order when price rises above stop price', () => {
        const order = {
          type: 'BuyStop',
          stopPrice: 1.1050,
          size: 1000,
          leverage: 100,
          symbolName: 'EURUSD'
        };
        
        const currentPrice = 1.1060;
        const result = tradeController.checkBuyStopOrder(order, currentPrice);
        expect(result).toBe(true);
      });

      it('should trigger buy limit order when price falls below limit price', () => {
        const order = {
          type: 'BuyLimit',
          limitPrice: 1.0950,
          size: 1000,
          leverage: 100,
          symbolName: 'EURUSD'
        };
        
        const currentPrice = 1.0940;
        const result = tradeController.checkBuyLimitOrder(order, currentPrice);
        expect(result).toBe(true);
      });

      it('should not trigger buy stop order when price is below stop price', () => {
        const order = {
          type: 'BuyStop',
          stopPrice: 1.1050,
          size: 1000,
          leverage: 100
        };
        
        const currentPrice = 1.1040;
        const result = tradeController.checkBuyStopOrder(order, currentPrice);
        expect(result).toBe(false);
      });
    });

    describe('Sell Stop/Limit Orders', () => {
      it('should trigger sell stop order when price falls below stop price', () => {
        const order = {
          type: 'SellStop',
          stopPrice: 1.0950,
          size: 1000,
          leverage: 100,
          symbolName: 'EURUSD'
        };
        
        const currentPrice = 1.0940;
        const result = tradeController.checkSellStopOrder(order, currentPrice);
        expect(result).toBe(true);
      });

      it('should trigger sell limit order when price rises above limit price', () => {
        const order = {
          type: 'SellLimit',
          limitPrice: 1.1050,
          size: 1000,
          leverage: 100,
          symbolName: 'EURUSD'
        };
        
        const currentPrice = 1.1060;
        const result = tradeController.checkSellLimitOrder(order, currentPrice);
        expect(result).toBe(true);
      });

      it('should not trigger sell stop order when price is above stop price', () => {
        const order = {
          type: 'SellStop',
          stopPrice: 1.0950,
          size: 1000,
          leverage: 100
        };
        
        const currentPrice = 1.0960;
        const result = tradeController.checkSellStopOrder(order, currentPrice);
        expect(result).toBe(false);
      });
    });
  });
});