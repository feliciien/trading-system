const formulaController = require('../../control/formulaController');

describe('Crypto Formula Tests', () => {
  test('should calculate CRYPTO/USD price correctly', async () => {
    const symbol = {
      code: 'BTCUSD',
      formulaType: 'CRYPTO/USD',
      baseCurrency: 'BTC',
      quoteCurrency: 'USD'
    };
    
    const result = await formulaController.calculateSymbolPrice(symbol, 50000);
    expect(result).toBe(50000);
  });
});