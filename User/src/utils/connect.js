const API_KEY = process.env.API_KEY;
const FETCH_INTERVAL = 1000; // 1 second

let isConnected = false;
let intervalId = null;

const fetchQuotes = async (symbols) => {
    try {
        const response = await fetch(
            `https://marketdata.tradermade.com/api/v1/live?currency=${symbols}&api_key=${API_KEY}`
        );
        const data = await response.json();

        if (data.quotes) {
            console.log("data:", data.quotes);
            return data.quotes;
        }
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return null;
    }
};

const connect = function () {
    if (isConnected) return;

    const symbols = "EURUSD,GBPUSD,USDJPY,AUDUSD,USDCAD,USDCHF";

    // Initial fetch
    fetchQuotes(symbols);

    // Set up periodic fetching
    intervalId = setInterval(() => {
        fetchQuotes(symbols);
    }, FETCH_INTERVAL);

    isConnected = true;
};

const disconnect = function () {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    isConnected = false;
    console.log('Disconnected from price feed');
};

module.exports = {
    connect,
    disconnect
};
