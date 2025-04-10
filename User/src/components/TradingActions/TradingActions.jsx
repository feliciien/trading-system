import React, { useState } from 'react';
import { useTakeProfit } from '../../hooks/useTakeProfit';
import { usePendingOrders } from '../../hooks/usePendingOrders';
import TradingCalculator from '../../utils/TradingCalculator';
import './TradingActions.css';

const TradingActions = ({ position, onExecuted, onOrderPlaced }) => {
    const { verifyTakeProfit, executeTakeProfit, isExecuting, error: takeProfitError } = useTakeProfit();
    const { placeOrder, isPlacingOrder, error: orderError } = usePendingOrders();

    // State to manage position values
    const [updatedPosition, setUpdatedPosition] = useState(position);
    const [orderDetails, setOrderDetails] = useState({
        type: '', // buyStop, buyLimit, sellStop, sellLimit
        price: '',
        stopLoss: '',
        takeProfit: '',
        lotSize: position.lotSize, // Default to the current position lot size
    });

    // Initialize the trading calculator
    const calculator = new TradingCalculator(
        position.baseCurrency,
        position.quoteCurrency,
        position.lotSize,
        position.accountBalance
    );

    const handleFieldChange = (field, value) => {
        if (['price', 'stopLoss', 'takeProfit', 'pips', 'percentage', 'balanceImpact'].includes(field)) {
            const updated = calculator.recalculate(updatedPosition, field, value);
            setUpdatedPosition({ ...updatedPosition, ...updated });
        } else {
            if (field === 'lotSize') {
                // Prevent reducing below 0.01 lots
                const adjustedValue = Math.max(0.01, parseFloat(value));
                if (adjustedValue === 0.01) {
                    // Signal closure if lot size is reduced to 0.01
                    setOrderDetails({ ...orderDetails, [field]: adjustedValue, closePosition: true });
                } else {
                    setOrderDetails({ ...orderDetails, [field]: adjustedValue });
                }
            } else {
                setOrderDetails({ ...orderDetails, [field]: value });
            }
        }
    };

    const handleTakeProfitExecution = async () => {
        try {
            const result = await executeTakeProfit(updatedPosition.id, updatedPosition.currentPrice);
            if (onExecuted) {
                onExecuted(result);
            }
        } catch (err) {
            console.error('Take profit execution failed:', err);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            const result = await placeOrder({ ...orderDetails, positionId: position.id });
            if (onOrderPlaced) {
                onOrderPlaced(result);
            }
        } catch (err) {
            console.error('Order placement failed:', err);
        }
    };

    return (
        <div className="trading-actions-container">
            <h3>Exit Trades</h3>
            <div className="field-group">
                <label>Take Profit (Price):</label>
                <input
                    type="number"
                    value={updatedPosition.takeProfit}
                    onChange={(e) => handleFieldChange('price', parseFloat(e.target.value))}
                />
            </div>
            <div className="field-group">
                <label>Stop Loss (Price):</label>
                <input
                    type="number"
                    value={updatedPosition.stopLoss}
                    onChange={(e) => handleFieldChange('stopLoss', parseFloat(e.target.value))}
                />
            </div>
            <div className="field-group">
                <label>Pips:</label>
                <input
                    type="number"
                    value={updatedPosition.pips}
                    onChange={(e) => handleFieldChange('pips', parseFloat(e.target.value))}
                />
            </div>
            <div className="field-group">
                <label>Percentage:</label>
                <input
                    type="number"
                    value={updatedPosition.percentage}
                    onChange={(e) => handleFieldChange('percentage', parseFloat(e.target.value))}
                />
            </div>
            <div className="field-group">
                <label>Balance Impact:</label>
                <input
                    type="number"
                    value={updatedPosition.balanceImpact}
                    onChange={(e) => handleFieldChange('balanceImpact', parseFloat(e.target.value))}
                />
            </div>
            {takeProfitError && <div className="error-message">{takeProfitError}</div>}
            <button
                onClick={handleTakeProfitExecution}
                disabled={isExecuting}
                className="take-profit-button"
            >
                {isExecuting ? 'Executing...' : 'Execute Take Profit'}
            </button>

            <h3>Pending Orders</h3>
            <div className="field-group">
                <label>Order Type:</label>
                <select
                    value={orderDetails.type}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                >
                    <option value="">Select Order Type</option>
                    <option value="buyStop">Buy Stop</option>
                    <option value="buyLimit">Buy Limit</option>
                    <option value="sellStop">Sell Stop</option>
                    <option value="sellLimit">Sell Limit</option>
                </select>
            </div>
            <div className="field-group">
                <label>Price:</label>
                <input
                    type="number"
                    value={orderDetails.price}
                    onChange={(e) => handleFieldChange('price', parseFloat(e.target.value))}
                />
            </div>
            <div className="field-group">
                <label>Stop Loss:</label>
                <input
                    type="number"
                    value={orderDetails.stopLoss}
                    onChange={(e) => handleFieldChange('stopLoss', parseFloat(e.target.value))}
                />
            </div>
            <div className="field-group">
                <label>Take Profit:</label>
                <input
                    type="number"
                    value={orderDetails.takeProfit}
                    onChange={(e) => handleFieldChange('takeProfit', parseFloat(e.target.value))}
                />
            </div>
            {orderError && <div className="error-message">{orderError}</div>}
            <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="place-order-button"
            >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
        </div>
    );
};

export default TradingActions;
