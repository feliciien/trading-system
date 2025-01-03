import { useState, useEffect } from 'react';
import { jpyXxxService } from '../services/symbolFormula/jpyXxxService';

export const useJpyXxx = (symbol) => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jpyXxxService.isJpyXxxPair(symbol)) {
      return;
    }

    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const newPrice = await jpyXxxService.getPrice(symbol);
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