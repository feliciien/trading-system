const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');

// Define specialSymbols directly in test file for testing purposes
const specialSymbols = {
    'US30': 'BLACKBULL:US30',
    'SPX500': 'BLACKBULL:SPX500',
    'GER30': 'BLACKBULL:GER30',
    'NATGAS': 'SKILLING:NATGAS',
    'OIL': 'EASYMARKETS:OILUSD'
};

class TraderMadeAPI {
    constructor(apiKey, options = {}) {
        this.apiKey = apiKey;
        this.options = {
            timeout: options.timeout || 5000,
            logFile: options.logFile || 'quotes.log',
            verbose: options.verbose || true,
            baseUrl: options.baseUrl || 'http://localhost:8000/api/v1'
        };
        this.logStream = fs.createWriteStream(this.options.logFile, { flags: 'a' });
    }

    async getQuote(symbols) {
        try {
            const currency = symbols.join(',');
            const url = `${this.options.baseUrl}/live?currency=${currency}&api_key=${this.apiKey}`;
            const data = await this._makeRequest(url);
            
            if (data.quotes && data.quotes.length > 0) {
                data.quotes.forEach(quote => {
                    this._logQuote(quote);
                });
                return data;
            } else {
                throw new Error('No quotes in response');
            }
        } catch (error) {
            this._logError('getQuote', symbols, error);
            throw error;
        }
    }

    async getSpecialQuote(symbol) {
        try {
            const provider = specialSymbols[symbol];
            if (!provider) {
                throw new Error(`No provider mapping for symbol: ${symbol}`);
            }

            const url = `${this.options.baseUrl}/live_special?symbol=${provider}&api_key=${this.apiKey}`;
            const data = await this._makeRequest(url);
            
            if (data.quotes && data.quotes[0]) {
                const quote = data.quotes[0];
                this._logQuote(quote);
                return quote;
            } else {
                throw new Error(`No quote data for ${symbol}`);
            }
        } catch (error) {
            this._logError('getSpecialQuote', symbol, error);
            throw error;
        }
    }

    async testSymbols(symbols) {
        if (!Array.isArray(symbols)) {
            symbols = [symbols];
        }

        console.log('\nTesting TraderMade API Connection...');
        console.log('----------------------------------------');

        // Split symbols into regular forex and special symbols
        const forexSymbols = symbols.filter(s => !specialSymbols[s]);
        const specialSymbolsList = symbols.filter(s => specialSymbols[s]);

        // Test results collection
        const results = {
            forex: [],
            special: []
        };

        // Test forex symbols
        if (forexSymbols.length) {
            console.log('\nTesting Forex Symbols:', forexSymbols.join(', '));
            try {
                const forexData = await this.getQuote(forexSymbols);
                results.forex = forexData;
            } catch (error) {
                console.error('Forex symbols error:', error.message);
            }
        }

        // Test special symbols
        if (specialSymbolsList.length) {
            console.log('\nTesting Special Symbols:', specialSymbolsList.join(', '));
            for (const symbol of specialSymbolsList) {
                try {
                    const specialData = await this.getSpecialQuote(symbol);
                    results.special.push(specialData);
                } catch (error) {
                    console.error(`${symbol} error:`, error.message);
                }
            }
        }

        return results;
    }

    async _makeRequest(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    _logQuote(data) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            ...data
        };
        this.logStream.write(JSON.stringify(logEntry) + '\n');
    }

    close() {
        this.logStream.end();
    }

    _logError(method, input, error) {
        const timestamp = new Date().toISOString();
        const errorEntry = {
            timestamp,
            method,
            input,
            error: error.message
        };
        
        // Write to log file
        this.logStream.write(JSON.stringify(errorEntry) + '\n');
        
        // Console output if verbose
        if (this.options.verbose) {
            console.error(`${timestamp} | Error in ${method} | Input: ${JSON.stringify(input)} | ${error.message}`);
        }
    }
}

// Test runner
if (require.main === module) {
    const testSymbols = [
        'EURUSD', 'GBPUSD', 'USDJPY',  // Forex
        'US30', 'SPX500', 'GER30',      // Indices
        'NATGAS', 'OIL'                 // Commodities
    ];

    const trader = new TraderMadeAPI('yo4p_W9Z_bE2bpBaFuhn', {
        timeout: 5000,
        logFile: 'forex_quotes_test.log',
        verbose: true
    });

    trader.testSymbols(testSymbols)
        .then((results) => {
            console.log('\nTest Results:', JSON.stringify(results, null, 2));
            trader.close();
            process.exit(0);
        })
        .catch(error => {
            console.error('\nTest failed:', error.message);
            trader.close();
            process.exit(1);
        });
}

module.exports = TraderMadeAPI;