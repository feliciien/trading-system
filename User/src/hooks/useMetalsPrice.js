import { useState, useEffect } from 'react';
import { MetalsService } from '../services';

export const useMetalsPrice = (symbol) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const newPrice = await MetalsService.getMetalPrice(symbol, price);
        if (mounted) {
          setPrice(newPrice);
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

    if (symbol && MetalsService.validateSymbol(symbol)) {
      fetchPrice();
    }

    return () => {
      mounted = false;
    };
  }, [symbol, price]);

  return {
    price,
    loading,
    error,
    decimalPlaces: MetalsService.getDecimalPlaces(symbol)
  };
};