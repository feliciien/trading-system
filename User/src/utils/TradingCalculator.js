class TradingCalculator {
    constructor(baseCurrency, quoteCurrency, lotSize, accountBalance, leverage = 1) {
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.lotSize = lotSize;
        this.accountBalance = accountBalance;
        this.leverage = leverage;
        this.pipMultiplier = this.getPipMultiplier();
        this.pipValue = this.calculatePipValue();
    }

    getPipMultiplier() {
        // Define pip multipliers for different currency pairs
        if (this.quoteCurrency === 'JPY') {
            return 0.01; // JPY pairs move in 0.01 increments
        }
        return 0.0001; // Standard forex pairs move in 0.0001 increments
    }

    calculatePipValue() {
        // Standard pip values adjusted for currency pair type
        const pipValues = {
            'USD': 10,  // Standard for USD as quote currency
            'EUR': 11.9, // Approximate for EUR as quote currency
            'GBP': 13.2, // Approximate for GBP as quote currency
            'JPY': 9.4  // Adjusted for JPY pairs (0.01 pip value)
        };

        return pipValues[this.quoteCurrency] || 10;
    }

    calculateMarginRequired(price) {
        // Calculate margin required based on position size and leverage
        const contractValue = this.lotSize * price;
        return contractValue / this.leverage;
    }

    calculateMaxLotSize(price) {
        // Calculate maximum lot size based on available balance and leverage
        const maxContractValue = this.accountBalance * this.leverage;
        return maxContractValue / price;
    }

    recalculate(position, field, value, type = 'takeProfit') {
        const updates = { ...position };
        const currentPrice = position.currentPrice;
        const isLong = position.type === 'buy';
        const prefix = type === 'takeProfit' ? 'takeProfit' : 'stopLoss';

        // Calculate margin requirements
        updates.marginRequired = this.calculateMarginRequired(currentPrice);
        updates.maxLotSize = this.calculateMaxLotSize(currentPrice);

        switch (field) {
            case 'price':
                updates[prefix] = value;
                updates[`${prefix}Pips`] = this.calculatePips(currentPrice, value, isLong);
                updates[`${prefix}Percentage`] = this.calculatePercentage(currentPrice, value, isLong);
                updates[`${prefix}Balance`] = this.calculateBalanceImpact(updates[`${prefix}Pips`], isLong);
                break;

            case 'pips':
                updates[`${prefix}Pips`] = value;
                updates[prefix] = this.calculatePrice(currentPrice, value, isLong);
                updates[`${prefix}Percentage`] = this.calculatePercentage(currentPrice, updates[prefix], isLong);
                updates[`${prefix}Balance`] = this.calculateBalanceImpact(value, isLong);
                break;

            case 'percentage':
                updates[`${prefix}Percentage`] = value;
                updates[prefix] = this.calculatePriceFromPercentage(currentPrice, value, isLong);
                updates[`${prefix}Pips`] = this.calculatePips(currentPrice, updates[prefix], isLong);
                updates[`${prefix}Balance`] = this.calculateBalanceImpact(updates[`${prefix}Pips`], isLong);
                break;

            case 'balance':
                updates[`${prefix}Balance`] = value;
                updates[`${prefix}Pips`] = this.calculatePipsFromBalance(value, isLong);
                updates[prefix] = this.calculatePrice(currentPrice, updates[`${prefix}Pips`], isLong);
                updates[`${prefix}Percentage`] = this.calculatePercentage(currentPrice, updates[prefix], isLong);
                break;
        }

        return updates;
    }

    calculatePips(entryPrice, targetPrice, isLong) {
        const diff = (targetPrice - entryPrice) / this.pipMultiplier;
        return isLong ? diff : -diff;
    }

    calculatePrice(currentPrice, pips, isLong) {
        const change = pips * this.pipMultiplier;
        return isLong ? currentPrice + change : currentPrice - change;
    }

    calculatePercentage(entryPrice, targetPrice, isLong) {
        const percentage = ((targetPrice - entryPrice) / entryPrice) * 100;
        return isLong ? percentage : -percentage;
    }

    calculatePriceFromPercentage(currentPrice, percentage, isLong) {
        const multiplier = 1 + (percentage / 100);
        return isLong ? currentPrice * multiplier : currentPrice / multiplier;
    }

    calculateBalanceImpact(pips, isLong) {
        // Include leverage in balance impact calculation
        const impact = pips * this.pipValue * this.lotSize * this.leverage;
        return isLong ? impact : -impact;
    }

    calculatePipsFromBalance(balance, isLong) {
        // Adjust pip calculation for leverage
        const pips = balance / (this.pipValue * this.lotSize * this.leverage);
        return isLong ? pips : -pips;
    }

    // Helper method to validate if a stop loss or take profit level is valid
    validateLevels(position, stopLoss, takeProfit) {
        const isLong = position.type === 'buy';
        const currentPrice = position.currentPrice;

        // Calculate margin requirements
        const marginRequired = this.calculateMarginRequired(currentPrice);
        const availableMargin = this.accountBalance;
        const isMarginSufficient = availableMargin >= marginRequired;

        if (isLong) {
            // For long positions: stop loss should be below current price, take profit above
            return {
                isValidStopLoss: stopLoss < currentPrice,
                isValidTakeProfit: takeProfit > currentPrice,
                isMarginSufficient,
                marginRequired,
                stopLossMessage: stopLoss >= currentPrice ? 'Stop loss must be below entry price for long positions' : '',
                takeProfitMessage: takeProfit <= currentPrice ? 'Take profit must be above entry price for long positions' : '',
                marginMessage: !isMarginSufficient ? `Insufficient margin. Required: ${marginRequired.toFixed(2)}` : ''
            };
        } else {
            // For short positions: stop loss should be above current price, take profit below
            return {
                isValidStopLoss: stopLoss > currentPrice,
                isValidTakeProfit: takeProfit < currentPrice,
                isMarginSufficient,
                marginRequired,
                stopLossMessage: stopLoss <= currentPrice ? 'Stop loss must be above entry price for short positions' : '',
                takeProfitMessage: takeProfit >= currentPrice ? 'Take profit must be below entry price for short positions' : '',
                marginMessage: !isMarginSufficient ? `Insufficient margin. Required: ${marginRequired.toFixed(2)}` : ''
            };
        }
    }
}

export default TradingCalculator;
