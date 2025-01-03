export const calculateTakeProfit = (position, currentPrice) => {
    const pipSize = 0.0001; // Standard for EURUSD
    const direction = position.type === 'Buy' ? 1 : -1;
    const priceDiff = (currentPrice - position.startPrice) * direction;
    const profit = (priceDiff / pipSize) * position.size * position.leverage;
    return Number((profit - (position.commission || 0)).toFixed(2));
  };
  
  export const shouldTriggerTakeProfit = (position, currentPrice) => {
    if (!position.takeProfit || position.takeProfit <= 0) return false;
    return position.type === 'Buy'
      ? currentPrice >= position.takeProfit
      : currentPrice <= position.takeProfit;
  };