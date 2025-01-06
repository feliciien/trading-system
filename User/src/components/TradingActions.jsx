import React, { useState, useEffect } from 'react';
import { useTakeProfit } from '../hooks/useTakeProfit';
import { usePendingOrders } from '../hooks/usePendingOrders';
import TradingCalculator from '../utils/TradingCalculator';
import './TradingActions.css';

const TradingActions = ({ position, onExecuted, onOrderPlaced }) => {
    const { verifyTakeProfit, executeTakeProfit, isExecuting, error: takeProfitError } = useTakeProfit();
    const { placeOrder, isPlacingOrder, error: orderError } = usePendingOrders();

    // State to manage position values
    const [updatedPosition, setUpdatedPosition] = useState(position);
    const [validation, setValidation] = useState({
        stopLoss: { isValid: true, message: '' },
        takeProfit: { isValid: true, message: '' }
    });

    // Initialize the trading calculator
    const calculator = new TradingCalculator(
        position.baseCurrency,
        position.quoteCurrency,
        position.lotSize,
        position.accountBalance
    );

    useEffect(() => {
        validateLevels();
    }, [updatedPosition.stopLoss, updatedPosition.takeProfit]);

    const validateLevels = () => {
        const result = calculator.validateLevels(
            position,
            updatedPosition.stopLoss,
            updatedPosition.takeProfit
        );

        setValidation({
            stopLoss: {
                isValid: result.isValidStopLoss,
                message: result.stopLossMessage
            },
            takeProfit: {
                isValid: result.isValidTakeProfit,
                message: result.takeProfitMessage
            }
        });
    };

    const handleFieldChange = (field, value, type = 'takeProfit') => {
        if (['price', 'pips', 'percentage', 'balance'].includes(field)) {
            const updated = calculator.recalculate(updatedPosition, field, parseFloat(value), type);
            setUpdatedPosition({ ...updatedPosition, ...updated });
        }
    };

    const handleTakeProfitExecution = async () => {
        if (!validation.takeProfit.isValid) return;
        try {
            const result = await executeTakeProfit(updatedPosition.id, updatedPosition.takeProfit);
            if (onExecuted) {
                onExecuted(result);
            }
        } catch (err) {
            console.error('Take profit execution failed:', err);
        }
    };

    return (
        <div className="trading-actions-container">
            <h3>Position Management</h3>
            
            {/* Stop Loss Section */}
            <div className="section stop-loss">
                <h4>Stop Loss</h4>
                <div className="field-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={updatedPosition.stopLoss || ''}
                        onChange={(e) => handleFieldChange('price', e.target.value, 'stopLoss')}
                        className={!validation.stopLoss.isValid ? 'invalid' : ''}
                    />
                </div>
                <div className="field-group">
                    <label>Pips:</label>
                    <input
                        type="number"
                        value={updatedPosition.stopLossPips || ''}
                        onChange={(e) => handleFieldChange('pips', e.target.value, 'stopLoss')}
                    />
                </div>
                <div className="field-group">
                    <label>Percentage:</label>
                    <input
                        type="number"
                        value={updatedPosition.stopLossPercentage || ''}
                        onChange={(e) => handleFieldChange('percentage', e.target.value, 'stopLoss')}
                    />
                </div>
                <div className="field-group">
                    <label>Balance Impact:</label>
                    <input
                        type="number"
                        value={updatedPosition.stopLossBalance || ''}
                        onChange={(e) => handleFieldChange('balance', e.target.value, 'stopLoss')}
                    />
                </div>
                {!validation.stopLoss.isValid && (
                    <div className="error-message">{validation.stopLoss.message}</div>
                )}
            </div>

            {/* Take Profit Section */}
            <div className="section take-profit">
                <h4>Take Profit</h4>
                <div className="field-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={updatedPosition.takeProfit || ''}
                        onChange={(e) => handleFieldChange('price', e.target.value, 'takeProfit')}
                        className={!validation.takeProfit.isValid ? 'invalid' : ''}
                    />
                </div>
                <div className="field-group">
                    <label>Pips:</label>
                    <input
                        type="number"
                        value={updatedPosition.takeProfitPips || ''}
                        onChange={(e) => handleFieldChange('pips', e.target.value, 'takeProfit')}
                    />
                </div>
                <div className="field-group">
                    <label>Percentage:</label>
                    <input
                        type="number"
                        value={updatedPosition.takeProfitPercentage || ''}
                        onChange={(e) => handleFieldChange('percentage', e.target.value, 'takeProfit')}
                    />
                </div>
                <div className="field-group">
                    <label>Balance Impact:</label>
                    <input
                        type="number"
                        value={updatedPosition.takeProfitBalance || ''}
                        onChange={(e) => handleFieldChange('balance', e.target.value, 'takeProfit')}
                    />
                </div>
                {!validation.takeProfit.isValid && (
                    <div className="error-message">{validation.takeProfit.message}</div>
                )}
            </div>

            {takeProfitError && <div className="error-message">{takeProfitError}</div>}
            
            <div className="actions">
                <button
                    onClick={handleTakeProfitExecution}
                    disabled={isExecuting || !validation.takeProfit.isValid}
                    className="take-profit-button"
                >
                    {isExecuting ? 'Executing...' : 'Execute Take Profit'}
                </button>
            </div>
        </div>
    );
};

export default TradingActions;
