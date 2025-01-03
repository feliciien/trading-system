import { useState, useEffect, useCallback } from 'react';
import { sellOrderService } from '../services/sellOrderService';

export const useSellOrder = (orderType, currentPrice) => {
  const [order, setOrder] = useState(null);
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    if (order && currentPrice) {
      const checkTrigger = () => {
        if (orderType === 'SellStop') {
          setIsTriggered(currentPrice <= order.stopPrice);
        } else {
          setIsTriggered(currentPrice >= order.limitPrice);
        }
      };
      checkTrigger();
    }
  }, [order, currentPrice, orderType]);

  const createOrder = useCallback(async (orderData) => {
    try {
      const service = orderType === 'SellStop' 
        ? sellOrderService.createSellStopOrder 
        : sellOrderService.createSellLimitOrder;
      
      const result = await service(orderData);
      setOrder(result);
      return true;
    } catch (error) {
      console.error('Failed to create order:', error);
      return false;
    }
  }, [orderType]);

  const cancelOrder = useCallback(async () => {
    if (!order) return false;
    try {
      await sellOrderService.cancelOrder(order.id);
      setOrder(null);
      return true;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  }, [order]);

  return {
    order,
    isTriggered,
    createOrder,
    cancelOrder
  };
};