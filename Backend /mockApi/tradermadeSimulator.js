const express = require('express');
const router = express.Router();

// Base prices from test cases
const basePrices = {
    // Forex pairs
    'EURUSD': { base: 1.04795, spread: 0.00008 },
    'GBPUSD': { base: 1.25925, spread: 0.00020 },
    'USDJPY': { base: 154.175, spread: 0.011 },
    'EURGBP': { base: 0.8802, spread: 0.0005 },
    'USDCHF': { base: 0.8850, spread: 0.00010 },
    'AUDUSD': { base: 0.6575, spread: 0.00008 },
    'USDCAD': { base: 1.3650, spread: 0.00010 },
    
    // Crypto pairs
    'BTCUSD': { base: 45005.00, spread: 10.00 },
    'ETHUSD': { base: 2250.50, spread: 1.00 },
    'USDTUSD': { base: 1.0001, spread: 0.0001 },
    
    // Indices
    'US30': { base: 35001.00, spread: 1.00, provider: 'BLACKBULL' },
    'SPX500': { base: 4780.50, spread: 0.50, provider: 'BLACKBULL' },
    'GER30': { base: 16801.00, spread: 0.50, provider: 'BLACKBULL' },
    
    // Metals & Commodities
    'XAUUSD': { base: 2002.50, spread: 0.25, provider: 'OANDA' },
    'XAGUSD': { base: 24.85, spread: 0.02, provider: 'OANDA' },
    'NATGAS': { base: 2.855, spread: 0.01, provider: 'SKILLING' },
    'OILUSD': { base: 75.325, spread: 0.05, provider: 'EASYMARKETS' }
};

// Add special symbols mapping
const specialSymbols = {
    'US30': 'BLACKBULL:US30',
    'SPX500': 'BLACKBULL:SPX500',
    'GER30': 'BLACKBULL:GER30',
    'NATGAS': 'SKILLING:NATGAS',
    'OIL': 'EASYMARKETS:OILUSD'
};

function getUndulatingPrice(basePrice, spread, timestamp) {
    const undulation = Math.sin(timestamp / 10000) * spread * 2;
    const mid = basePrice + undulation;
    return {
        bid: mid - spread / 2,
        ask: mid + spread / 2,
        mid: mid
    };
}

// Simulate the /api/v1/live endpoint
router.get('/live', (req, res) => {
    const currencies = req.query.currency.split(',');
    const timestamp = Date.now();
    
    const quotes = currencies.map(pair => {
        const [base, quote] = [pair.slice(0, 3), pair.slice(3)];
        const baseData = basePrices[pair];
        
        if (!baseData) return null;
        
        const price = getUndulatingPrice(baseData.base, baseData.spread, timestamp);
        
        return {
            base_currency: base,
            quote_currency: quote,
            bid: Number(price.bid.toFixed(5)),
            ask: Number(price.ask.toFixed(5)),
            mid: Number(price.mid.toFixed(5))
        };
    }).filter(quote => quote !== null);

    if (quotes.length === 0) {
        return res.status(404).json({ error: 'No valid symbols found' });
    }

    res.json({
        endpoint: 'live',
        quotes,
        requested_time: new Date(timestamp).toUTCString(),
        timestamp: Math.floor(timestamp / 1000)
    });
});

// Simulate the /api/v1/live_special endpoint
router.get('/live_special', (req, res) => {
    const symbol = req.query.symbol;
    const [provider, code] = symbol.split(':');
    const baseData = basePrices[code];
    const timestamp = Date.now();

    if (!baseData || baseData.provider !== provider) {
        return res.status(404).json({ error: 'Symbol not found' });
    }

    const price = getUndulatingPrice(baseData.base, baseData.spread, timestamp);

    res.json({
        endpoint: 'live_special',
        quotes: [{
            symbol: code,
            bid: Number(price.bid.toFixed(2)),
            ask: Number(price.ask.toFixed(2)),
            provider: baseData.provider
        }],
        requested_time: new Date(timestamp).toUTCString(),
        timestamp: Math.floor(timestamp / 1000)
    });
});

module.exports = router;