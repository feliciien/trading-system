import { useState, useEffect, useCallback } from 'react';
import { stopLossService } from '../services/stopLossService';

export const useStopLoss = (position, currentPrice) => {
  const [stopLossPrice, setStopLossPrice] = useState(position?.stopLoss || 0);
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    if (position && currentPrice) {
      const checkStopLoss = () => {
        if (position.type === 'Buy') {
          setIsTriggered(currentPrice <= stopLossPrice);
        } else {
          setIsTriggered(currentPrice >= stopLossPrice);
        }
      };
      checkStopLoss();
    }
  }, [position, currentPrice, stopLossPrice]);

  const updateStopLoss = useCallback(async (updateID, updateProfit, updateLoss) => {
    try {
      await stopLossService.updateStopLoss(updateID, updateProfit, updateLoss);
      setStopLossPrice(updateLoss);
      return true;
    } catch (error) {
      console.error('Failed to update stop loss:', error);
      return false;
    }
  }, [position]);

  return {
    position,
    stopLossPrice,
    isTriggered,
    updateStopLoss
  };
};