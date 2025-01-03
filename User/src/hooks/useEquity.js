import { useState, useEffect } from "react";
import { getEquityUpdates } from "../services/equityService";

const POLL_INTERVAL = 30000;
const RETRY_DELAY = 5000;

export const useEquity = (balance, positions) => {
  const [equity, setEquity] = useState(Number(balance) || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let pollTimer;
    let mounted = true;

    const updateEquity = async () => {
      try {
        if (!mounted) return;
        setLoading(true);

        // Log initial state
        console.log("useEquity hook - before update:", {
          currentEquity: equity,
          balance: Number(balance) || 0,
          positionsCount: positions?.length || 0,
        });

        const updatedEquity = await getEquityUpdates();

        // Log response
        console.log("useEquity hook - after update:", {
          updatedEquity,
          balance: Number(balance) || 0,
          positionsCount: positions?.length || 0,
        });

        if (mounted) {
          // Ensure we store a valid number
          setEquity(Number(updatedEquity) || Number(balance) || 0);
          setError(null);
          setRetryCount(0);
        }
      } catch (err) {
        console.error("useEquity hook error:", err);
        if (mounted) {
          setError(err.message);
          setRetryCount((prev) => prev + 1);
          // Fallback to balance on error
          setEquity(Number(balance) || 0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    updateEquity();

    pollTimer = setInterval(
      updateEquity,
      retryCount > 0 ? POLL_INTERVAL + retryCount * RETRY_DELAY : POLL_INTERVAL
    );

    return () => {
      mounted = false;
      clearInterval(pollTimer);
    };
  }, [balance, equity, positions?.length, retryCount]);

  return {
    equity: Number(equity) || Number(balance) || 0,
    loading,
    error,
  };
};
