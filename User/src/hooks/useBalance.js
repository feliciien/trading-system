import { useState, useCallback } from 'react';
import { balanceService } from '../services/balanceService';

export const useBalance = (initialBalance = 0) => {
  const [balance, setBalance] = useState(initialBalance);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);

  const verifyBalance = useCallback(async (userId) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const isValid = await balanceService.verifyBalance(userId, balance);
      return isValid;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [balance]);

  return {
    balance,
    setBalance,
    verifyBalance,
    isVerifying,
    error
  };
};