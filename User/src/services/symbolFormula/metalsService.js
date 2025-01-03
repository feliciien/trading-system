import axiosInstance from '../../utils/axios';

class MetalsService {
  static async getMetalPrice(symbol, price) {
    try {
      const response = await axiosInstance.get(`/api/prices/${symbol}`);
      return Number(response.data.price);
    } catch (error) {
      throw new Error(`Metal price calculation failed: ${error.message}`);
    }
  }

  static validateSymbol(symbol) {
    const validCodes = ['XAUUSD', 'XAGUSD', 'OIL', 'NATGAS'];
    return validCodes.includes(symbol.code);
  }

  static getDecimalPlaces(symbol) {
    return 2; // All metals/commodities use 2 decimal places
  }
}

export default MetalsService;