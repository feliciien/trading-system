class TradingCalculator {
    constructor(baseCurrency, quoteCurrency, lotSize, accountBalance) {
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.lotSize = lotSize;
        this.accountBalance = accountBalance;
        this.pipValue = this.calculatePipValue();
    }

    calculatePipValue() {
        // Standard pip values for major currency pairs (can be expanded)
        const pipValues = {
            'USD': 10,  // Standard for USD as quote currency
            'EUR': 11.9, // Approximate for EUR as quote currency
            'GBP': 13.2, // Approximate for GBP as quote currency
            'JPY': 0.094 // Approximate for JPY as quote currency
        };

        return pipValues[this.quoteCurrency] || 10; // Default to 10 if currency not found
    }

    recalculate(position, field, value) {
        const updates = { ...position };
        const currentPrice = position.currentPrice;

        switch (field) {
            case 'price':
                updates.takeProfit = value;
                updates.pips = this.calculatePips(currentPrice, value);
                updates.percentage = this.calculatePercentage(currentPrice, value);
                updates.balanceImpact = this.calculateBalanceImpact(updates.pips);
                break;

            case 'pips':
                updates.pips = value;
                updates.takeProfit = this.calculatePrice(currentPrice, value);
                updates.percentage = this.calculatePercentage(currentPrice, updates.takeProfit);
                updates.balanceImpact = this.calculateBalanceImpact(value);
                break;

            case 'percentage':
                updates.percentage = value;
                updates.takeProfit = this.calculatePriceFromPercentage(currentPrice, value);
                updates.pips = this.calculatePips(currentPrice, updates.takeProfit);
                updates.balanceImpact = this.calculateBalanceImpact(updates.pips);
                break;

            case 'balanceImpact':
                updates.balanceImpact = value;
                updates.pips = this.calculatePipsFromBalance(value);
                updates.takeProfit = this.calculatePrice(currentPrice, updates.pips);
                updates.percentage = this.calculatePercentage(currentPrice, updates.takeProfit);
                break;
        }

        return updates;
    }

    calculatePips(entryPrice, targetPrice) {
        return Math.abs((targetPrice - entryPrice) * 10000);
    }

    calculatePrice(currentPrice, pips) {
        return currentPrice + (pips / 10000);
    }

    calculatePercentage(entryPrice, targetPrice) {
        return ((targetPrice - entryPrice) / entryPrice) * 100;
    }

    calculatePriceFromPercentage(currentPrice, percentage) {
        return currentPrice * (1 + percentage / 100);
    }

    calculateBalanceImpact(pips) {
        return (pips * this.pipValue * this.lotSize);
    }

    calculatePipsFromBalance(balance) {
        return balance / (this.pipValue * this.lotSize);
    }
}

export default TradingCalculator;
