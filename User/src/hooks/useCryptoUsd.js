import { useState, useEffect } from 'react';
import { cryptoUsdService } from '../services/symbolFormula/cryptoUsdService';

export const useCryptoUsd = (symbol) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const newPrice = await cryptoUsdService.getPrice(symbol);
        if (mounted) {
          setPrice(newPrice);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (cryptoUsdService.isCryptoUsdPair(symbol)) {
      fetchPrice();
      const interval = setInterval(fetchPrice, 1000);
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }
  }, [symbol]);

  return { price, loading, error };
};