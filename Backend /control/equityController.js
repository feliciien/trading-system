const calculateUnrealizedPnL = (position) => {
    const {
      type,
      startPrice,
      currentPrice,
      size,
      leverage,
      pipSize,
      commission
    } = position;
  
    const priceDiff = type === 'Buy' 
      ? currentPrice - startPrice
      : startPrice - currentPrice;
  
    return (priceDiff / pipSize) * size * leverage - commission;
  };
  
  const updateEquity = (user) => {
    const { balance, positions = [] } = user;
    
    const unrealizedPnL = positions.reduce((total, position) => 
      total + calculateUnrealizedPnL(position), 0);
  
    return balance + unrealizedPnL;
  };
  
  module.exports = {
    updateEquity,
    calculateUnrealizedPnL
  };