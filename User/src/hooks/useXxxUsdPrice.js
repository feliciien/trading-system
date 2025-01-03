import { useState, useEffect } from 'react';
import { xxxUsdService } from '../services/symbolFormula/xxxUsdService';

export const useXxxUsdPrice = (symbol) => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!xxxUsdService.isXxxUsdPair(symbol)) {
      setError('Invalid symbol format');
      return;
    }

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const newPrice = await xxxUsdService.getPrice(symbol);
        setPrice(newPrice);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 1000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  return { price, error, loading };
};