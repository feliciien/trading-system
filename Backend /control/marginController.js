const MarginModel = require('../models/marginModel');

class MarginController {
  static async validateMargin(position, symbolInfo) {
    try {
      const requiredMargin = MarginModel.calculateRequiredMargin(position, symbolInfo);
      
      if (requiredMargin === 0) {
        return {
          isValid: false,
          error: 'Invalid margin calculation parameters'
        };
      }

      const usedMargin = await MarginModel.getTotalUsedMargin(position.userId);
      const hasEnoughMargin = MarginModel.validateMarginRequirement(
        position.balance,
        usedMargin,
        requiredMargin
      );

      return {
        isValid: hasEnoughMargin,
        requiredMargin,
        usedMargin,
        availableMargin: position.balance - usedMargin
      };
    } catch (error) {
      console.error('Margin validation error:', error);
      throw new Error('Failed to validate margin requirements');
    }
  }

  static calculateMargin(position, symbolInfo) {
    return MarginModel.calculateRequiredMargin(position, symbolInfo);
  }
}

module.exports = MarginController;