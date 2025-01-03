import { useState, useCallback } from 'react';
import { takeProfitService } from '../services/takeProfitService';

export const useTakeProfit = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  const verifyTakeProfit = useCallback(async (position) => {
    setIsVerifying(true);
    setError(null);
    try {
      const result = await takeProfitService.verifyTakeProfit(position);
      return result;
    } catch (err) {
      setError(err.message);
      return { shouldTrigger: false, profit: 0 };
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const executeTakeProfit = useCallback(async (positionId, currentPrice) => {
    setIsExecuting(true);
    setError(null);
    try {
      const result = await takeProfitService.executeTakeProfit(positionId, currentPrice);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  return {
    verifyTakeProfit,
    executeTakeProfit,
    isVerifying,
    isExecuting,
    error
  };
};