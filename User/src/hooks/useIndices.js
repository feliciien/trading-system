import { useState, useEffect } from 'react';
import { indicesService } from '../services/indicesService';

export const useIndices = (symbol) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const newPrice = await indicesService.getPrice(symbol);
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

  return { price, loading, error };
};