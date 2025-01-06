import React from 'react';

const SymbolSelector = ({ symbols, selectedSymbol, onSymbolChange }) => {
    return (
        <select 
            value={selectedSymbol} 
            onChange={(e) => onSymbolChange(e.target.value)}
        >
            {symbols && symbols.map(symbol => (
                <option key={symbol} value={symbol}>
                    {symbol}
                </option>
            ))}
        </select>
    );
};

const TradingViewWidget = ({ symbols = [] }) => {
    if (!Array.isArray(symbols)) {
        console.warn('TradingViewWidget: symbols prop must be an array');
        return null;
    }

    return (
        <select>
            {symbols.map(symbol => (
                <option key={symbol} value={symbol}>
                    {symbol}
                </option>
            ))}
        </select>
    );
};

export default TradingViewWidget;