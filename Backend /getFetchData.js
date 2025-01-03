const WebSocket = require('ws');
const http = require('http');
const global = require("./config/global");
const { checkPosition } = require("./control/tradeController");
const config = require('./config/main');

const API_KEY = "yo4p_W9Z_bE2bpBaFuhn";
const FETCH_INTERVAL = 1000;
const MISMATCH_LOG_INTERVAL = 60000;
let lastMismatchLog = 0;

const processArrayInChunks = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        result.push(chunk.join(','));
    }
    return result;
};

const getDataWithSocket = (ws, key, symbols, allSymbols) => {
    ws.on('open', function open() {
        ws.send(`{"userKey":"${key}", "symbol":"${symbols}"}`);
    });

    ws.on('message', (event) => {
        try {
            const data = event.toString();
            if (data === "Connected") {
                console.log('WebSocket connected successfully');
                return;
            }
            if (data === "User Key Used to many times") {
                console.error("WebSocket API key limit exceeded:", key);
                return;
            }
            
            const parsedData = JSON.parse(data);
            global.bids[allSymbols.indexOf(parsedData.symbol)] = parsedData.bid;
            global.asks[allSymbols.indexOf(parsedData.symbol)] = parsedData.ask;
            checkPosition();
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });

    ws.on('close', () => {
        console.warn('WebSocket closed, attempting reconnect...');
        setTimeout(() => {
            const newWs = new WebSocket(config.wsEndpoint);
            getDataWithSocket(newWs, key, symbols, allSymbols);
        }, 5000);
    });
};

const getRealtimeData = function (symbols) {
    try {
        const symbolCodes = symbols.map(s => s.dataValues?.code || s);
        
        if (!symbolCodes || !Array.isArray(symbolCodes)) {
            console.error('Invalid symbols input');
            return;
        }

        global.bids = new Array(symbolCodes.length).fill(0);
        global.asks = new Array(symbolCodes.length).fill(0);
        global.symbols = symbolCodes;

        if (!config.useSimulator) {
            // Use WebSocket connections
            const symbolChunks = processArrayInChunks(symbolCodes, config.chunkSize);
            
            symbolChunks.forEach((chunk, index) => {
                if (index < config.wsApiKeys.length) {
                    const ws = new WebSocket(config.wsEndpoint);
                    getDataWithSocket(ws, config.wsApiKeys[index], chunk, symbolCodes);
                }
            });
        } else {
            // Use simulator
            const fetchAndLog = async () => {
                try {
                    const response = await fetch(`${config.simulatorEndpoint}/live?currency=${symbolCodes.join(',')}`);
                    const data = await response.json();
                    
                    if (data.quotes) {
                        data.quotes.forEach(quote => {
                            const symbol = quote.base_currency + quote.quote_currency;
                            const symbolIndex = symbolCodes.indexOf(symbol);
                            if (symbolIndex !== -1) {
                                global.bids[symbolIndex] = quote.bid;
                                global.asks[symbolIndex] = quote.ask;
                            }
                        });
                        checkPosition();
                    }
                } catch (error) {
                    console.error('Simulator fetch error:', error);
                }
            };
            
            fetchAndLog();
            return setInterval(fetchAndLog, FETCH_INTERVAL);
        }
    } catch (error) {
        console.error('Price feed initialization error:', error);
    }
};

module.exports = getRealtimeData;
