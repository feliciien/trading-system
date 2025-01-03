const createPosition = ({
    type,
    startPrice,
    currentPrice,
    size,
    leverage,
    pipSize = 0.0001,
    commission = 0
  }) => ({
    type,
    startPrice,
    currentPrice,
    size,
    leverage,
    pipSize,
    commission
  });
  
  const calculatePipValue = (position) => {
    const { size, leverage } = position;
    return size * leverage;
  };
  
  module.exports = {
    createPosition,
    calculatePipValue
  };