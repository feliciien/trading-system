global.initialBalance = 1000;
global.bids = {};
global.asks = {};
global.symbols = [];

jest.mock('../models', () => ({
  Position: {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  User: {
    findOne: jest.fn(),
    update: jest.fn()
  },
  Symbols: {
    findOne: jest.fn()
  },
  Assets: {
    findOne: jest.fn()
  }
}));