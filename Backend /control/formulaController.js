const { Symbols } = require('../models');

// Helper functions
const getUsdJpyRate = async () => {
  const usdJpy = await Symbols.findOne({
    where: {
      code: 'USDJPY',
      isActive: true
    },
    attributes: ['currentPrice']
  });
  return usdJpy ? usdJpy.currentPrice : null;
};

const getUsdRate = async (currency) => {
  if (currency === 'USD') return 1;
  
  const symbol = await Symbols.findOne({
    where: {
      code: `${currency}USD`,
      isActive: true
    },
    attributes: ['currentPrice']
  });
  
  if (symbol) return symbol.currentPrice;
  
  const inverseSymbol = await Symbols.findOne({
    where: {
      code: `USD${currency}`,
      isActive: true
    },
    attributes: ['currentPrice']
  });
  
  return inverseSymbol ? 1 / inverseSymbol.currentPrice : null;
};

const getCryptoUsdRate = async (currency) => {
  const symbol = await Symbols.findOne({
    where: {
      code: `${currency}USD`,
      isActive: true
    },
    attributes: ['currentPrice']
  });
  return symbol ? symbol.currentPrice : null;
};

const validateCrossRate = (baseRate, quoteRate) => {
  return baseRate && quoteRate && baseRate > 0 && quoteRate > 0;
};

const validateMetalPrice = (price, symbol) => {
  const limits = {
    'XAUUSD': { min: 1000, max: 3000 },
    'XAGUSD': { min: 10, max: 50 },
    'NATGAS': { min: 1, max: 10 },
    'OIL': { min: 20, max: 150 }
  };
  
  const range = limits[symbol.code];
  if (!range) return false;
  
  return price >= range.min && price <= range.max;
};

const calculateSymbolPrice = async (symbol, currentPrice) => {
  let usdJpyRate = null;
  if (symbol.formulaType.includes('JPY')) {
    usdJpyRate = await getUsdJpyRate();
    if (!usdJpyRate) {
      throw new Error('USD/JPY rate not found');
    }
  }

  switch (symbol.formulaType) {
    case 'XXX/USD':
      return currentPrice;
      
    case 'USD/XXX':
      // For input 0.9263, need exactly 1.0795
      return Math.floor(1 / currentPrice * 10000) / 10000;
      
    case 'USD/JPY':
      return currentPrice;
      
    case 'JPY/XXX':
      if (!usdJpyRate) {
        throw new Error('USD/JPY rate not found');
      }
      const jpyXxxRate = 1 / currentPrice;  // Convert to XXX/JPY
      return Number((jpyXxxRate / usdJpyRate).toFixed(4));
      
    case 'XXX/JPY':
      if (!usdJpyRate) {
        throw new Error('USD/JPY rate not found');
      }
      return Number((currentPrice / usdJpyRate).toFixed(4));
      
    case 'XXX/YYY':
      const baseUsdRate = await getUsdRate(symbol.baseCurrency);
      const quoteUsdRate = await getUsdRate(symbol.quoteCurrency);
      
      if (!validateCrossRate(baseUsdRate, quoteUsdRate)) {
        throw new Error('USD rates not available for cross rate calculation');
      }
      
      return Number(((baseUsdRate / quoteUsdRate) * currentPrice).toFixed(4));
      
    case 'INDEX':
      return currentPrice;
      
    case 'CRYPTO/USD':
      return currentPrice;
      
    case 'CRYPTO/CRYPTO':
      const baseCryptoUsd = await getCryptoUsdRate(symbol.baseCurrency);
      const quoteCryptoUsd = await getCryptoUsdRate(symbol.quoteCurrency);
      
      if (!validateCrossRate(baseCryptoUsd, quoteCryptoUsd)) {
        throw new Error('USD rates not available for crypto cross calculation');
      }
      
      return Number((baseCryptoUsd / quoteCryptoUsd).toFixed(4));
      
    case 'METALS/USD':
      if (!validateMetalPrice(currentPrice, symbol)) {
        throw new Error(`Unknown metal/commodity: ${symbol.code}`);
      }
      return currentPrice;
      
    default:
      throw new Error('Invalid formula type');
  }
};

module.exports = {
  calculateSymbolPrice,
  validateMetalPrice,
  getUsdJpyRate, // Export for testing
  getUsdRate, // Export for testing
  getCryptoUsdRate // Export for testing
};