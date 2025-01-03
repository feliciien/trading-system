import { useState, useEffect } from 'react';
import { xxxYyyService } from '../services/symbolFormula/xxxYyyService';

export const useXxxYyyPrice = (symbol, baseCurrency, quoteCurrency) => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!xxxYyyService.isXxxYyyPair(symbol, baseCurrency, quoteCurrency)) {
      setError('Invalid symbol format');
      return;
    }

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const newPrice = await xxxYyyService.getPrice(symbol);
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
  }, [symbol, baseCurrency, quoteCurrency]);

  return { price, error, loading };
};