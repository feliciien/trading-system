const MarginController = require('../../control/marginController');
const MarginModel = require('../../models/marginModel');
const { Position } = require('../../models');

describe('Margin Calculation and Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateMargin()', () => {
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
      
      const result = MarginController.calculateMargin(position, symbolInfo);
      expect(result).toBeCloseTo(11.00, 2);
    });

    it('should handle zero leverage correctly', () => {
      const position = {
        size: 1000,
        startPrice: 1.1000,
        leverage: 0
      };
      
      const result = MarginController.calculateMargin(position, {});
      expect(result).toBe(0);
    });
  });

  describe('validateMargin()', () => {
    it('should validate margin requirements correctly', async () => {
      const position = {
        userId: 1,
        balance: 1000,
        size: 1000,
        startPrice: 1.1000,
        leverage: 100
      };

      Position.findAll = jest.fn().mockResolvedValue([]);
      
      const result = await MarginController.validateMargin(position, {});
      expect(result.isValid).toBe(true);
      expect(result.requiredMargin).toBeCloseTo(11.00, 2);
    });
  });
});