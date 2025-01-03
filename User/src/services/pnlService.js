const calculatePnL = async (position) => {
    try {
      const response = await fetch('/api/pnl/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(position)
      });
      const data = await response.json();
      return data.pnl;
    } catch (error) {
      console.error('Error calculating PnL:', error);
      return 0;
    }
  };
  
  const getUnrealizedPnL = async (positions) => {
    try {
      const response = await fetch('/api/pnl/unrealized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ positions })
      });
      const data = await response.json();
      return data.unrealizedPnL;
    } catch (error) {
      console.error('Error getting unrealized PnL:', error);
      return 0;
    }
  };
  
  export const pnlService = {
    calculatePnL,
    getUnrealizedPnL
  };