const { Position } = require('./index');

class MarginModel {
  static calculateRequiredMargin(position, symbolInfo) {
    if (!position || !position.leverage || position.leverage <= 0) {
      return 0;
    }

    const { size, startPrice, leverage } = position;
    return (size * startPrice) / leverage;
  }

  static validateMarginRequirement(balance, usedMargin, requiredMargin) {
    const availableMargin = balance - usedMargin;
    return availableMargin >= requiredMargin;
  }

  static async getTotalUsedMargin(userId) {
    const positions = await Position.findAll({
      where: { userId, status: 'Open' }
    });

    return positions.reduce((total, position) => {
      const margin = this.calculateRequiredMargin(position);
      return total + (margin || 0);
    }, 0);
  }
}

module.exports = MarginModel;