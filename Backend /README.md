# Run all tests
npm test

# Run specific test file
npm test -- accountValue/balance.test.js

BE-LaserTrader/tests/
├── accountValue/
│   ├── balance.test.js
│   ├── equity.test.js
│   ├── margin.test.js
│   └── pnl.test.js
├── orderExecution/
│   ├── stopLoss.test.js
│   ├── takeProfit.test.js
│   ├── buyOrders.test.js
│   └── sellOrders.test.js
└── symbolFormula/
    ├── crypto.test.js
    ├── crypto/
    │   ├── cryptoUsd.test.js
    │   └── cryptoCrypto.test.js
    ├── currencyPairs.test.js
    ├── currencyPairs/
    │   ├── xxxUsd.test.js
    │   ├── usdXxx.test.js
    │   ├── usdJpy.test.js
    │   ├── jpyXxx.test.js
    │   └── xxxYyy.test.js
    ├── indices.test.js
    └── metals.test.js