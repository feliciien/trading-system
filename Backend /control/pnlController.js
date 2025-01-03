const { calculatePipValue } = require('../models/pnlModel');

const calculatePriceDiff = (position) => {
  const { type, currentPrice, startPrice } = position;
  const multiplier = type === 'Sell' ? -1 : 1;
  return multiplier * (currentPrice - startPrice);
};

const calculatePnL = (position) => {
  if (!position || !position.currentPrice) return 0;
  
  const priceDiff = calculatePriceDiff(position);
  const pipValue = calculatePipValue(position);
  const pipDiff = priceDiff / (position.pipSize || 0.0001);
  
  return (pipDiff * pipValue) - (position.commission || 0);
};

const calculateUnrealizedPnL = (positions) => {
  if (!Array.isArray(positions)) return 0;
  return positions.reduce((total, position) => total + calculatePnL(position), 0);
};

module.exports = {
  calculatePnL,
  calculateUnrealizedPnL,
  calculatePriceDiff
};