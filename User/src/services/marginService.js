const calculateMargin = (position) => {
    if (!position || !position.leverage || position.leverage <= 0) {
      return 0;
    }
  
    const { size, startPrice, leverage } = position;
    return Number(((size * startPrice) / leverage).toFixed(2));
  };
  
  const validateMarginRequirement = (balance, usedMargin, requiredMargin) => {
    const availableMargin = balance - usedMargin;
    return availableMargin >= requiredMargin;
  };
  
  const calculateTotalMargin = (positions) => {
    return positions.reduce((total, position) => {
      const margin = calculateMargin(position);
      return total + (margin || 0);
    }, 0);
  };
  
  export const marginService = {
    calculateMargin,
    validateMarginRequirement,
    calculateTotalMargin
  };