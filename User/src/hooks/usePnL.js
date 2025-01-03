import { useState, useEffect } from 'react';
import { pnlService } from '../services/pnlService';

export const usePnL = (positions, currentPrices) => {
  const [pnl, setPnL] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculatePositionsPnL = async () => {
      if (!positions?.length || !currentPrices) return;
      
      setLoading(true);
      try {
        const positionsWithPrices = positions.map(position => ({
          ...position,
          currentPrice: currentPrices[position.symbolName]
        }));
        
        const unrealizedPnL = await pnlService.getUnrealizedPnL(positionsWithPrices);
        setPnL(unrealizedPnL);
        setError(null);
      } catch (err) {
        console.error('PnL calculation error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    calculatePositionsPnL();
  }, [positions, currentPrices]);

  return { pnl, loading, error };
};