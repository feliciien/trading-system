const SellOrderController = require('../../control/sellOrderController');
const SellOrderModel = require('../../models/sellOrderModel');

describe('Sell Order Execution Tests', () => {
  describe('Sell Stop Orders', () => {
    it('should trigger sell stop when price falls below stop price', () => {
      const order = {
        type: 'SellStop',
        stopPrice: 1.0950,
        size: 1000,
        leverage: 100,
        symbolName: 'EURUSD'
      };
      
      const result = SellOrderController.verifySellStop(order, 1.0940);
      expect(result.shouldTrigger).toBe(true);
      expect(result.executionPrice).toBe(1.0940);
    });

    it('should not trigger sell stop when price is above stop price', () => {
      const order = {
        type: 'SellStop',
        stopPrice: 1.0950,
        size: 1000,
        leverage: 100
      };
      
      const result = SellOrderController.verifySellStop(order, 1.0960);
      expect(result.shouldTrigger).toBe(false);
    });
  });

  describe('Sell Limit Orders', () => {
    it('should trigger sell limit when price rises above limit price', () => {
      const order = {
        type: 'SellLimit',
        limitPrice: 1.1050,
        size: 1000,
        leverage: 100,
        symbolName: 'EURUSD'
      };
      
      const result = SellOrderController.verifySellLimit(order, 1.1060);
      expect(result.shouldTrigger).toBe(true);
      expect(result.executionPrice).toBe(1.1060);
    });

    it('should handle edge cases correctly', () => {
      const order = {
        type: 'SellLimit',
        limitPrice: 1.1050,
        size: 1000,
        leverage: 100
      };
      
      const result = SellOrderController.verifySellLimit(order, 1.1050);
      expect(result.shouldTrigger).toBe(true);
    });
  });
});