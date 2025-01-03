import { useState, useEffect } from 'react';
import { usdJpyService } from '../services/symbolFormula/usdJpyService';

export const useUsdJpy = (symbol) => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!usdJpyService.isUsdJpyPair(symbol)) {
      return;
    }

    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const newPrice = await usdJpyService.getPrice(symbol);
        setPrice(newPrice);
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