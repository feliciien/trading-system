import { useState, useEffect } from 'react';
import { cryptoCryptoService } from '../services/symbolFormula/cryptoCryptoService';

export const useCryptoCrypto = (symbol) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState({ base: '', quote: '' });

  useEffect(() => {
    let mounted = true;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const newPrice = await cryptoCryptoService.getPrice(symbol);
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

    if (cryptoCryptoService.isCryptoCryptoPair(symbol)) {
      // Parse currencies from symbol
      setCurrencies(cryptoCryptoService.parsePairCurrencies(symbol));
      
      // Start price updates
      fetchPrice();
      const interval = setInterval(fetchPrice, 1000);
      
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }
  }, [symbol]);

  return { price, loading, error, ...currencies };
};