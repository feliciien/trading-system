import React from 'react';
import { useTakeProfit } from '../../hooks/useTakeProfit';

const TakeProfit = ({ position, onExecuted }) => {
  const { verifyTakeProfit, executeTakeProfit, isExecuting, error } = useTakeProfit();

  const handleTakeProfitExecution = async () => {
    try {
      const result = await executeTakeProfit(position.id, position.currentPrice);
      if (onExecuted) {
        onExecuted(result);
      }
    } catch (err) {
      console.error('Take profit execution failed:', err);
    }
  };

  return (
    <div className="take-profit-container">
      <div className="take-profit-value">
        Take Profit: {position.takeProfit}
      </div>
      {error && <div className="error-message">{error}</div>}
      <button 
        onClick={handleTakeProfitExecution}
        disabled={isExecuting}
        className="take-profit-button"
      >
        {isExecuting ? 'Executing...' : 'Execute Take Profit'}
      </button>
    </div>
  );
};

export default TakeProfit;