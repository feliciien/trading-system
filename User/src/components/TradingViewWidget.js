const SymbolSelector = ({ symbols, selectedSymbol, onSymbolChange }) => {
    return (
        <select 
            value={selectedSymbol} 
            onChange={(e) => onSymbolChange(e.target.value)}
        >
            {symbols.map(symbol => (
                <option key={symbol} value={symbol}>
                    {symbol}
                </option>
            ))}
        </select>
    );
};

const TradingViewWidget = ({ symbols }) => {
    return (
        <select>
            {symbols.map(symbol => (
                <SymbolOption key={symbol} symbol={symbol} />
            ))}
        </select>
    );
};