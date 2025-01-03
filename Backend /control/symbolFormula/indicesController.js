const calculateIndicesPrice = (price, symbol = '') => {
    if (price <= 0) {
      throw new Error('Invalid index price');
    }
  
    // Round to 2 decimal places
    return Number(price.toFixed(2));
  };
  
  calculateIndicesPrice.validatePrice = (price, symbol) => {
    const ranges = {
      'US30': { min: 30000, max: 40000 },
      'SPX500': { min: 4000, max: 5000 },
      'NAS100': { min: 15000, max: 18000 }
    };
  
    if (!ranges[symbol]) {
      return true; // Skip validation if symbol not found
    }
  
    const { min, max } = ranges[symbol];
    return price >= min && price <= max;
  };
  
  module.exports = { calculateIndicesPrice };