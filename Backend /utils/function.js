// Utility functions to calculate P/L and Margin for different trading scenarios

// P/L and Margin Calculation for Any Pair/USD
function calculateAnyPairUSD(entryPrice, exitPrice, lotSize, quotePrice, leverage) {
    const pipValue = 100000; // Standard pip value for forex
    const profitLoss = (exitPrice - entryPrice) * lotSize * pipValue / quotePrice * leverage;
    const margin = (lotSize * pipValue) / leverage;
    return { profitLoss, margin };
}

// P/L and Margin Calculation for USD/Any Pair
function calculateUSDAnyPair(entryPrice, exitPrice, lotSize, leverage) {
    const pipValue = 100000; // Standard pip value for forex
    const profitLoss = (exitPrice - entryPrice) * lotSize * pipValue * leverage;
    const margin = (lotSize * pipValue) / leverage;
    return { profitLoss, margin };
}

// P/L and Margin Calculation for USD/JPY
function calculateUSDJPY(entryPrice, exitPrice, lotSize, leverage) {
    const pipValue = 1000; // Pip value for JPY pairs
    const profitLoss = (exitPrice - entryPrice) * lotSize * pipValue * leverage;
    const margin = (lotSize * pipValue) / leverage;
    return { profitLoss, margin };
}

// P/L and Margin Calculation for JPY/Any Pair Converted to USD
function calculateJPYAnyPair(entryPrice, exitPrice, lotSize, quotePrice, leverage) {
    const pipValue = 1000; // Pip value for JPY pairs
    const profitLoss = (exitPrice - entryPrice) * lotSize * pipValue / quotePrice * leverage;
    const margin = (lotSize * pipValue / quotePrice) / leverage;
    return { profitLoss, margin };
}

// P/L and Margin Calculation for Any/Any Converted to USD
function calculateAnyAnyConverted(entryPrice, exitPrice, lotSize, conversionRate, leverage) {
    const pipValue = 100000; // Standard pip value for forex
    const profitLoss = (exitPrice - entryPrice) * lotSize * pipValue / conversionRate * leverage;
    const margin = (lotSize * pipValue / conversionRate) / leverage;
    return { profitLoss, margin };
}

// P/L and Margin Calculation for Indices
function calculateIndices(entryPrice, exitPrice, lotSize, pointValue, leverage) {
    const profitLoss = (exitPrice - entryPrice) * lotSize * pointValue * leverage;
    const margin = (lotSize * pointValue) / leverage;
    return { profitLoss, margin };
}

// P/L and Margin Calculation for Crypto/USD
function calculateCryptoUSD(entryPrice, exitPrice, lotSize, leverage) {
    const profitLoss = (exitPrice - entryPrice) * lotSize * leverage;
    const margin = lotSize / leverage;
    return { profitLoss, margin };
}

// P/L and Margin Calculation for Crypto/Crypto Converted to USD
function calculateCryptoCrypto(entryPrice, exitPrice, lotSize, conversionRate, leverage) {
    const profitLoss = (exitPrice - entryPrice) * lotSize * conversionRate * leverage;
    const margin = (lotSize * conversionRate) / leverage;
    return { profitLoss, margin };
}

// P/L and Margin Calculation for Metals to USD
function calculateMetalsToUSD(entryPrice, exitPrice, lotSize, leverage) {
    const pipValue = 100; // Standard pip value for metals (e.g., Gold)
    const profitLoss = (exitPrice - entryPrice) * lotSize * pipValue * leverage;
    const margin = (lotSize * pipValue) / leverage;
    return { profitLoss, margin };
}

// Exporting functions for modular use
module.exports = {
    calculateAnyPairUSD,
    calculateUSDAnyPair,
    calculateUSDJPY,
    calculateJPYAnyPair,
    calculateAnyAnyConverted,
    calculateIndices,
    calculateCryptoUSD,
    calculateCryptoCrypto,
    calculateMetalsToUSD
};