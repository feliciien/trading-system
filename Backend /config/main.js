const dotenv = require("dotenv");
dotenv.config();

// Automatically determine if we're running locally
const isLocalEnvironment = process.env.NODE_ENV !== 'production' && 
    (process.env.HOSTNAME === 'localhost' || 
     process.env.HOST === 'localhost' || 
     process.env.HOST === '127.0.0.1');

// TOGGLE SIMULATOR: True by default, can be overridden by environment
const USE_SIMULATOR = process.env.FORCE_SIMULATOR !== 'false';

const WS_API_KEYS = [
    "wsx87-Jw_pCkochqfjRA",
    "sio76eTyy_xVnWelsLa4Q",
    "wsidCrWyEJPCbxqcQqnQ"
];

module.exports = {
    useSimulator: USE_SIMULATOR,
    port: process.env.PORT || 8000,
    simulatorEndpoint: 'http://localhost:8000/api/v1',
    tradermadeEndpoint: 'https://marketdata.tradermade.com/api/v1',
    wsEndpoint: 'wss://marketdata.tradermade.com/feedadv',
    wsApiKeys: WS_API_KEYS,
    chunkSize: 10,  // Number of symbols per WebSocket connection

    database: {
        type: process.env.DB_TYPE || "mysql",
        host: process.env.DB_HOST || "127.0.0.1",
        name: process.env.DB_NAME || "trading",
        user: process.env.DB_USER || "root",
        port: process.env.DB_PORT || "3306",
        pass: process.env.DB_PASS || "12345",
        logging: process.env.DB_LOGGING === "true",
    },

    siteEndpoint: process.env.WW_SiteEndpoint,
}