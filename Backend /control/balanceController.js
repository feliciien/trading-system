const BalanceModel = require('../models/balanceModel');

class BalanceController {
  static async verifyBalance(userId, expectedBalance) {
    const positions = await BalanceModel.findPositionsForUser(userId);
    const { totalProfit, totalCommission } = BalanceModel.calculateTotalProfitAndCommission(positions);
    
    const calculatedBalance = global.initialBalance + totalProfit - totalCommission;
    const tolerance = 0.001; // Floating point comparison tolerance
    
    return Math.abs(calculatedBalance - expectedBalance) < tolerance;
  }
}

module.exports = BalanceController;