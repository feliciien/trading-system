const { Position } = require('../../models');
const BalanceController = require('../../control/balanceController');

describe('Balance Verification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.initialBalance = 1000;
  });

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
      const result = await BalanceController.verifyBalance(1, 1045.25);
      expect(result).toBe(true);
    });

    it('should handle zero balance correctly', async () => {
      const mockPositions = [
        { realProfit: -997.50, commission: 2.50, status: 'Closed' }
      ];
      Position.findAll.mockResolvedValue(mockPositions);
      const result = await BalanceController.verifyBalance(1, 0);
      expect(result).toBe(true);
    });

    it('should handle database errors', async () => {
      Position.findAll.mockRejectedValue(new Error('Database error'));
      await expect(BalanceController.verifyBalance(1, 1000))
        .rejects.toThrow('Database error');
    });

    it('should return false for incorrect balance', async () => {
      const mockPositions = [
        { realProfit: 100, commission: 2.50, status: 'Closed' }
      ];
      Position.findAll.mockResolvedValue(mockPositions);
      const result = await BalanceController.verifyBalance(1, 1200); // Wrong expected balance
      expect(result).toBe(false);
    });
  });
});