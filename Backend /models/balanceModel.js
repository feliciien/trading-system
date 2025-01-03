const { Position } = require('./index');

class BalanceModel {
  static async findPositionsForUser(userId) {
    return Position.findAll({
      where: { userId, status: 'Closed' }
    });
  }

  static calculateTotalProfitAndCommission(positions) {
    return positions.reduce((acc, position) => ({
      totalProfit: acc.totalProfit + position.realProfit,
      totalCommission: acc.totalCommission + position.commission
    }), { totalProfit: 0, totalCommission: 0 });
  }
}

module.exports = BalanceModel;