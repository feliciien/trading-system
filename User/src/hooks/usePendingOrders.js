import { useState, useCallback } from 'react';
import { pendingOrdersService } from '../services/pendingOrdersService';

export const usePendingOrders = () => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  const placeOrder = useCallback(async (orderDetails) => {
    setIsPlacingOrder(true);
    setError(null);
    try {
      const result = await pendingOrdersService.placeOrder(orderDetails);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsPlacingOrder(false);
    }
  }, []);

  return {
    placeOrder,
    isPlacingOrder,
    error
  };
};
