import { useBalance } from '../hooks/useBalance';
import TakeProfit from '../../components/TakeProfit/TakeProfit';

const axios = require('axios');
const _ = require('lodash');
const API_KEY = process.env.API_KEY;

const pipSizes = {
    major_pairs: 0.0001,
    jpy_pairs: 0.01,
    oils: 0.01,
    metals: 0.01,
    cryptos: 0.0001,
    indices: 1
};

const getRealTimeData = async (symbol) => {
    try {
        const response = await fetch(
            `https://marketdata.tradermade.com/api/v1/live?currency=${symbol}&api_key=${API_KEY}`
        );
        const data = await response.json();
        if (data.quotes && data.quotes[0]) {
            const quote = data.quotes[0];
            return {
                bid: quote.bid,
                ask: quote.ask
            };
        }
        throw new Error('Invalid quote data');
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return null;
    }
};

const executeOrder = (symbol, orderType, size, price) => {
    const latency = _.random(0, 0.1);
    const slippage = _.random(-0.0001, 0.0001);
    const executedPrice = price + slippage;
    return executedPrice;
};

const calculatePips = (entryPrice, exitPrice, assetType) => {
    const pipSize = pipSizes[assetType];
    return (exitPrice - entryPrice) / pipSize;
};

const checkStopLossTakeProfit = (currentPrice, stopLoss, takeProfit, entryPrice) => {
    if (currentPrice <= stopLoss) {
        return { action: 'stop_loss', price: currentPrice };
    } else if (currentPrice >= takeProfit) {
        return { action: 'take_profit', price: currentPrice };
    }
    return { action: null, price: null };
};

class Position {
    constructor(symbol, size, entryPrice, assetType, side, createdAt) {
        this.symbol = symbol;
        this.size = size;
        this.entryPrice = entryPrice;
        this.assetType = assetType;
        this.side = side;  // Buy or Sell
        this.createdAt = createdAt;
        this.stopLoss = entryPrice * (side === 'buy' ? (1 - 0.01) : (1 + 0.01));
        this.takeProfit = entryPrice * (side === 'buy' ? (1 + 0.02) : (1 - 0.02));
        this.unrealizedPnL = 0;
        this.realizedPnL = 0;
    }

    updateUnrealizedPnL(currentPrice) {
        const pips = calculatePips(this.entryPrice, currentPrice, this.assetType);
        this.unrealizedPnL = pips * this.size;
    }
}

class Account {
    constructor(balance) {
        this.balance = balance;
        this.positions = [];
        this.closedPositions = [];
    }

    openPosition(symbol, size, entryPrice, assetType, side) {
        const createdAt = new Date().toISOString();
        const position = new Position(symbol, size, entryPrice, assetType, side, createdAt);
        this.positions.push(position);
    }

    closePosition(position, exitPrice) {
        const pips = calculatePips(position.entryPrice, exitPrice, position.assetType);
        position.realizedPnL = pips * position.size;
        this.balance += position.realizedPnL;
        position.closedAt = new Date().toISOString();
        position.exitPrice = exitPrice;
        this.closedPositions.push(position);
        this.positions = this.positions.filter(p => p !== position);
    }

    updatePositions(currentPrices) {
        this.positions.forEach(position => {
            position.updateUnrealizedPnL(currentPrices[position.symbol]);
        });
    }

    getPositionsData() {
        return this.positions.map(position => ({
            instrument: position.symbol,
            side: position.side,
            size: position.size,
            entryPrice: position.entryPrice,
            stopLoss: position.stopLoss,
            takeProfit: position.takeProfit,
            createdAt: position.createdAt,
            unrealizedPnL: position.unrealizedPnL,
            positionId: _.uniqueId('pos_')
        }));
    }

    getClosedPositionsData() {
        return this.closedPositions.map(position => ({
            instrument: position.symbol,
            side: position.side,
            size: position.size,
            entryPrice: position.entryPrice,
            exitPrice: position.exitPrice,
            stopLoss: position.stopLoss,
            takeProfit: position.takeProfit,
            createdAt: position.createdAt,
            closedAt: position.closedAt,
            realizedPnL: position.realizedPnL,
            positionId: _.uniqueId('pos_'),
            reasonForClosing: position.realizedPnL >= 0 ? 'take_profit' : 'stop_loss'
        }));
    }

    toJSON() {
        return {
            balance: this.balance,
            openPositions: this.getPositionsData(),
            closedPositions: this.getClosedPositionsData()
        };
    }

    async verifyCurrentBalance(userId) {
        return await balanceService.verifyBalance(userId, this.balance);
    }
}

const account = new Account(100000);  // Starting with $100,000

const tradingLoop = async () => {
    const symbols = ['EURUSD', 'USDJPY', 'XAUUSD', 'BTCUSD', 'US30'];
    const assetTypes = ['major_pairs', 'jpy_pairs', 'metals', 'cryptos', 'indices'];
    const sides = ['buy', 'sell'];
    const stopLossPercentage = 0.01;
    const takeProfitPercentage = 0.02;

    const STATUS_LOG_INTERVAL = 300000; // Log every 5 minutes
    let lastStatusLog = 0;
    let iterationCount = 0;

    while (trading) {
        iterationCount++;

        // Update positions
        account.updatePositions(currentPrices);

        // Log status every 5 minutes
        const now = Date.now();
        if (now - lastStatusLog > STATUS_LOG_INTERVAL) {
            console.log("Trading Status:", {
                timestamp: new Date().toISOString(),
                activePositions: account.positions.length,
                iteration: iterationCount,
                uptime: Math.floor((now - startTime) / 1000 / 60) + ' minutes'
            });
            lastStatusLog = now;
        }

        for (const position of account.positions) {
            const currentPrice = currentPrices[position.symbol];
            const stopLoss = position.entryPrice * (1 - stopLossPercentage);
            const takeProfit = position.entryPrice * (1 + takeProfitPercentage);
            const { action, price } = checkStopLossTakeProfit(currentPrice, stopLoss, takeProfit, position.entryPrice);

            if (action) {
                account.closePosition(position, price);
            }
        }

        for (const [index, symbol] of symbols.entries()) {
            const assetType = assetTypes[index];
            const size = 10000;
            const side = sides[Math.floor(Math.random() * sides.length)];
            const { bid, ask } = await getRealTimeData(symbol);
            console.log(bid, ask)
            const entryPrice = (bid + ask) / 2;
            account.openPosition(symbol, size, entryPrice, assetType, side);
        }

        // Send the account data to the client
        ws.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(account.toJSON()));
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

ws.on('connection', socket => {
    socket.on('message', message => {
        const { action, symbol } = JSON.parse(message);

        if (action === 'start') {
            trading = true;
            tradingLoop(symbol);
        } else if (action === 'stop') {
            trading = false;
        }
    });

    socket.on('close', () => {
        trading = false;
    });
});

const PRICE_LOG_INTERVAL = 300000; // Log every 5 minutes
const MISSING_SYMBOLS_LOG_INTERVAL = 300000; // Log missing symbols every 5 minutes
let lastPriceLogTime = 0;
let lastMissingSymbolsLogTime = 0;

ws.on('message', data => {
    try {
        const parsedData = JSON.parse(data);
        if (!Array.isArray(parsedData)) {
            console.error('Invalid price data format');
            return;
        }

        const now = Date.now();
        const receivedCount = parsedData.filter(item =>
            item && item.key && !isNaN(item.value) && !isNaN(item.chg)
        ).length;

        // Log price mismatches every 5 minutes
        if (now - lastPriceLogTime > PRICE_LOG_INTERVAL && receivedCount < expected) {
            console.warn({
                event: 'PRICE_UPDATE_SUMMARY',
                expected: 15,
                received: receivedCount,
                lastUpdate: new Date().toISOString()
            });
            lastPriceLogTime = now;
        }

        // Process prices
        currentPrices = parsedData.reduce((acc, item) => {
            if (item && item.key && !isNaN(item.value) && !isNaN(item.chg)) {
                acc[item.key] = {
                    value: parseFloat(item.value),
                    chg: parseFloat(item.chg)
                };
            }
            return acc;
        }, {});

        // Log missing symbols every 5 minutes
        if (now - lastMissingSymbolsLogTime > MISSING_SYMBOLS_LOG_INTERVAL) {
            const missingSymbols = symbols.filter(symbol => !currentPrices[symbol]);
            if (missingSymbols.length > 0) {
                console.warn('Missing prices for symbols:', missingSymbols.join(', '));
                lastMissingSymbolsLogTime = now;
            }
        }
    } catch (error) {
        console.error('Error processing price update:', error);
    }
});