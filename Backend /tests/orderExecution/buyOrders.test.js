const BuyOrderController = require('../../control/buyOrderController');
const BuyOrderModel = require('../../models/buyOrderModel');

describe('Buy Order Execution Tests', () => {
  describe('Buy Stop Orders', () => {
    it('should trigger buy stop when price rises above stop price', () => {
      const order = {
        type: 'BuyStop',
        stopPrice: 1.1050,
        size: 1000,
        leverage: 100,
        symbolName: 'EURUSD'
      };
      
      const result = BuyOrderController.verifyBuyStop(order, 1.1060);
      expect(result.shouldTrigger).toBe(true);
      expect(result.executionPrice).toBe(1.1060);
    });

    it('should not trigger buy stop when price is below stop price', () => {
      const order = {
        type: 'BuyStop',
        stopPrice: 1.1050,
        size: 1000,
        leverage: 100
      };
      
      const result = BuyOrderController.verifyBuyStop(order, 1.1040);
      expect(result.shouldTrigger).toBe(false);
    });
  });

  describe('Buy Limit Orders', () => {
    it('should trigger buy limit when price falls below limit price', () => {
      const order = {
        type: 'BuyLimit',
        limitPrice: 1.0950,
        size: 1000,
        leverage: 100,
        symbolName: 'EURUSD'
      };
      
      const result = BuyOrderController.verifyBuyLimit(order, 1.0940);
      expect(result.shouldTrigger).toBe(true);
      expect(result.executionPrice).toBe(1.0940);
    });

    it('should handle edge cases correctly', () => {
      const order = {
        type: 'BuyLimit',
        limitPrice: 1.0950,
        size: 1000,
        leverage: 100
      };
      
      // Test exact price match
      const result = BuyOrderController.verifyBuyLimit(order, 1.0950);
      expect(result.shouldTrigger).toBe(true);
    });
  });
});