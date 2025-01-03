const {
  Positions,
  User,
  Symbols,
  Assets,
  Commission,
  Leverage
} = require('../models');
const global = require('../config/global');
const { where } = require('sequelize');
const symbols = require('../models/symbols');
const BalanceModel = require('../models/balanceModel');

// const Symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF']
// const leverage = 1, pip_size = 0.0001, commission = 0.03;               //////getUserInfo from data

// exports.createPosition = async (req, res) => {
//     const { amount, symbol, option } = req.body;
//     const user = await User.findOne({ where: { token: req.headers.authorization } })
//     const { balance, usedMargin } = user;
//     const symbolIndex = await Symbols.findOne({ where: { code: symbol } });
//     const leverage_all = await Leverage.findOne({ where: { companyEmail: user.companyEmail } });
//     const leverage = leverage_all[`${symbolIndex.assetName}`]
//     // console.log("leverage" ,leverage_all,symbolIndex.assetName,",", leverage);

//     const asset = await Assets.findOne({ where: { name: symbolIndex.assetName } });
//     const commissions = await Commission.findOne({ where: { companyEmail: user.companyEmail } });
//     const commission = commissions[`${symbolIndex.assetName}`] * amount / 0.01;
//     // console.log(symbolIndex.assetName, commission);
//     const pip_size = asset.pip_size;
//     const symbolID = symbolIndex.id;
//     const updateMargin = (usedMargin + amount / pip_size * (option ? global.bids[global.symbols.indexOf(symbol)] : global.asks[global.symbols.indexOf(symbol)]) * leverage).toFixed(2);
//     // console.log(usedMargin, amount, pip_size, (option ? global.bids[global.symbols.indexOf(symbol)] : global.asks[global.symbols.indexOf(symbol)]));
//     // console.log(updateMargin + commission, ",", balance, ",", Number(updateMargin) + Number(commission) > Number(balance));
//     if (Number(updateMargin) + Number(commission) > balance) {
//         res.status(200).json({ state: "Your balance is not enough" });
//         return;
//     }
//     await Positions.create({
//         userID: user.id,
//         type: option ? "Sell" : "Buy",
//         size: amount,
//         status: 'Open',
//         symbolName: symbol,
//         commission: commission,
//         leverage: leverage,
//         startPrice: option ? global.bids[global.symbols.indexOf(symbol)] : global.asks[global.symbols.indexOf(symbol)],
//     });

//     await User.update({ balance: balance, usedMargin: updateMargin ? updateMargin : 0 }, { where: { id: user.id } });
//     const PositionList = await Positions.findAll({ where: { status: 'Open', userID: user.id } });

//     res.status(200).json({ positions: PositionList, balance: user.balance, margin: updateMargin });
// };

const createPosition = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { token: req.headers.authorization }
    });

    const { symbol, amount, option, leverage, stopLoss, takeProfit } = req.body;
    const { balance } = user;
    let commission
    const companycommission = await Commission.findOne({
      where: { companyEmail: user.companyEmail }
    });
    const asset = await Symbols.findOne({
      where: { code: symbol }
    });

    if (asset.assetName === "Forex") {
      commission = companycommission.Forex
    } else if (asset.assetName === "Indices") {
      commission = companycommission.Indices
    } else if (asset.assetName === "Crypto") {
      commission = companycommission.Crypto
    } else if (asset.assetName === "Futures") {
      commission = companycommission.Futures
    }

    const commissionCal = companycommission[`${asset.assetName}`] * amount / 0.01;

    const currentPrice = option
      ? global.asks[global.symbols.indexOf(symbol)]
      : global.bids[global.symbols.indexOf(symbol)];

    const updateMargin = Number(
      ((amount * currentPrice) / leverage).toFixed(2)
    ) || 0;

    if (Number(updateMargin) + Number(commissionCal) > Number(balance)) {
      return res.status(200).json({ state: 'Your balance is not enough' });
    }

    await Positions.create({
      userID: user.id,
      type: option ? 'Sell' : 'Buy',
      size: amount,
      status: 'Open',
      symbolName: symbol,
      commission: commissionCal,
      leverage: leverage,
      startPrice: currentPrice,
      stopLoss: stopLoss,
      takeProfit: takeProfit
    });

    await User.update(
      { balance: balance - commissionCal, usedMargin: updateMargin },
      { where: { id: user.id } }
    );

    const PositionList = await Positions.findAll({
      where: { status: 'Open', userID: user.id }
    });

    res.status(200).json({
      positions: PositionList,
      balance: balance - commissionCal,
      margin: updateMargin
    });
  } catch (error) {
    console.error('Error in createPosition:', error);
    res.status(500).json({ error: 'An error occurred while creating position.' });
  }
};

const closePosition = async (req, res) => {
  try {
    const { positionId, currentPrice, closeReason } = req.body;
    const position = await Positions.findOne({
      where: { id: positionId }
    });

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    const user = await User.findOne({
      where: { id: position.userID }
    });

    // Calculate PnL based on formula from take-profit.md lines 31-36
    const priceDiff = (currentPrice - position.startPrice) *
      (position.type === 'Buy' ? 1 : -1);
    const pipDiff = priceDiff / 0.0001;
    const profit = (pipDiff * position.size * position.leverage) -
      position.commission;

    // Update margin and balance as per balance.md lines 20-24
    const updateMargin = user.usedMargin -
      ((position.size * position.startPrice) / position.leverage);
    const updateBalance = user.balance + profit;

    // Update position status
    await Positions.update({
      status: 'Close',
      closePrice: currentPrice,
      realProfit: profit,
      closeReason: closeReason || 'Manual',
      closeTime: new Date()
    }, {
      where: { id: positionId }
    });

    // Update user balance and margin
    await User.update({
      usedMargin: Math.max(0, updateMargin),
      balance: updateBalance
    }, {
      where: { id: user.id }
    });

    // Get updated positions for response
    const openPositions = await Positions.findAll({
      where: { status: 'Open', userID: user.id }
    });

    const closedPositions = await Positions.findAll({
      where: { status: 'Close', userID: user.id }
    });

    res.status(200).json({
      positions: openPositions,
      realPositions: closedPositions,
      margin: Math.max(0, updateMargin),
      balance: updateBalance
    });

  } catch (error) {
    console.error('Error in closePosition:', error);
    res.status(500).json({
      error: 'An error occurred while closing position.'
    });
  }
};

const checkPosition = async () => {
  try {
    const PositionList = await Positions.findAll({ where: { status: 'Open' } });

    for (const position of PositionList) {
      const symbolIndex = await Symbols.findOne({
        where: { code: position.symbolName }
      });
      const asset = await Assets.findOne({
        where: { name: symbolIndex.assetName }
      });
      const user = await User.findOne({ where: { id: position.userID } });

      if (!symbolIndex || !asset || !user) {
        console.error('Missing required data for position check:', position.id);
        continue;
      }

      const pip_size = asset.pip_size;
      const currentPrice = position.type !== 'Sell'
        ? global.bids[global.symbols.indexOf(position.symbolName)]
        : global.asks[global.symbols.indexOf(position.symbolName)];

      if (!currentPrice) {
        console.error('Missing price data for symbol:', position.symbolName);
        continue;
      }

      // Calculate PnL using the formula from pnl.md
      const priceDiff = (currentPrice - position.startPrice) *
        (position.type === 'Buy' ? 1 : -1);
      const pipDiff = priceDiff / pip_size;
      const profit = (pipDiff * position.size * position.leverage) -
        position.commission;

      // Check take profit condition
      if (checkTakeProfit(position, currentPrice)) {
        await handlePositionClose(position, currentPrice, profit, user, 'TakeProfit');
        continue;
      }

      // Check stop loss condition
      if (checkStopLoss(position, currentPrice)) {
        await handlePositionClose(position, currentPrice, profit, user, 'StopLoss');
      }
    }
  } catch (error) {
    console.error('Error in checkPosition:', error);
  }
};

const handlePositionClose = async (position, currentPrice, profit, user, closeReason) => {
  const updateMargin = user.usedMargin -
    ((position.size * position.startPrice) / position.leverage);
  const updateBalance = user.balance + profit;

  await Positions.update({
    status: 'Close',
    stopPrice: currentPrice,
    realProfit: profit,
    closeReason: closeReason,
    closeTime: new Date()
  }, {
    where: { id: position.id }
  });

  await User.update({
    usedMargin: Math.max(0, updateMargin),
    balance: updateBalance
  }, {
    where: { id: user.id }
  });
};

const getAllPosition = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { token: req.headers.authorization }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const PositionList = await Positions.findAll({
      where: { status: 'Open', userID: user.id }
    });
    const RealPositionList = await Positions.findAll({
      where: { status: 'Close', userID: user.id }
    });

    // Calculate real-time equity as per take-profit.md requirements
    const currentPrices = {};
    for (const position of PositionList) {
      currentPrices[position.symbolName] = position.type === 'Buy'
        ? global.bids[global.symbols.indexOf(position.symbolName)]
        : global.asks[global.symbols.indexOf(position.symbolName)];
    }

    const equity = updateEquity(user.balance, PositionList, currentPrices);

    res.status(200).json({
      positions: PositionList,
      realPositions: RealPositionList,
      margin: user.usedMargin,
      balance: user.balance,
      equity: equity
    });
  } catch (error) {
    console.error('Error in getAllPosition:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
};

const updatePosition = async (req, res) => {
  try {
    const { positionId, updateProfit, updateLoss } = req.body;
    const user = await User.findOne({
      where: { token: req.headers.authorization }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate input parameters
    if (updateProfit === undefined && updateLoss === undefined) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const position = await Positions.findOne({
      where: { id: positionId }
    });

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // Validate take profit and stop loss values
    if (position.type === 'Buy') {
      if (updateProfit && updateProfit <= position.startPrice) {
        return res.status(400).json({
          error: 'Take profit must be higher than entry price for long positions'
        });
      }
      if (updateLoss && updateLoss >= position.startPrice) {
        return res.status(400).json({
          error: 'Stop loss must be lower than entry price for long positions'
        });
      }
    } else {
      if (updateProfit && updateProfit >= position.startPrice) {
        return res.status(400).json({
          error: 'Take profit must be lower than entry price for short positions'
        });
      }
      if (updateLoss && updateLoss <= position.startPrice) {
        return res.status(400).json({
          error: 'Stop loss must be higher than entry price for short positions'
        });
      }
    }

    await Positions.update(
      {
        takeProfit: updateProfit ? Number(updateProfit) : position.takeProfit,
        stopLoss: updateLoss ? Number(updateLoss) : position.stopLoss
      },
      { where: { id: positionId } }
    );

    const PositionList = await Positions.findAll({
      where: { status: 'Open', userID: user.id }
    });

    res.status(200).json({
      positions: PositionList,
      message: 'Position updated successfully'
    });
  } catch (error) {
    console.error('Error in updatePosition:', error);
    res.status(500).json({ error: 'Failed to update position' });
  }
};

const getSymbols = async (req, res) => {
  try {
    const symbols = await Symbols.findAll({
      attributes: ['code', 'name', 'type', 'assetName', 'formulaName']
    });

    // Use map to create an array of promises
    const new_symbols = await Promise.all(
      symbols.map(async (symbol) => {
        const asset = await Assets.findOne({
          where: { name: symbol.assetName }
        });
        // Handle missing or invalid price data as per indices.md error cases
        const currentPrice = global.bids[global.symbols.indexOf(symbol.code)];
        if (!currentPrice || isNaN(currentPrice)) {
          console.warn(`Missing or invalid price for symbol: ${symbol.code}`);
        }

        return {
          code: symbol.code,
          name: symbol.name,
          type: symbol.type,
          assetName: symbol.assetName,
          formulaName: symbol.formulaName,
          pip_size: asset ? asset.pip_size : null,
          currentPrice: currentPrice || null
        };
      })
    );
    // console.log(new_symbols, "new_symbols")
    // Filter out symbols with missing required data
    const validSymbols = new_symbols.filter(symbol =>
      symbol.pip_size !== null && symbol.currentPrice !== null
    );

    return res.status(200).json(validSymbols);
  } catch (error) {
    console.error('Error fetching symbols with pip_size:', error);
    return res.status(500).json({
      error: 'An error occurred while fetching symbols.'
    });
  }
};

const getTradingDatas = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { token: req.headers.authorization }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const accounts = await User.findAll({
      where: { name: user.name }
    });

    const commissions = await Commission.findOne({
      where: { companyEmail: user.companyEmail }
    });

    if (!commissions) {
      return res.status(404).json({ error: 'Commission data not found' });
    }

    // Get all positions first
    const positionsPromises = accounts.map(account =>
      Positions.findAll({
        where: { userID: account.id, status: 'Open' }
      })
    );

    const allPositions = await Promise.all(positionsPromises);

    // Then verify margin calculations
    const marginCheck = allPositions.every(positions =>
      positions.every(position => {
        const calculatedMargin = (position.size * position.startPrice) / position.leverage;
        return Math.abs(calculatedMargin - position.margin) < 0.001;
      })
    );

    if (!marginCheck) {
      console.warn('Margin calculation mismatch detected');
    }

    return res.status(200).json({
      commissions: commissions,
      accounts: accounts
    });
  } catch (error) {
    console.error('Error in getTradingDatas:', error);
    return res.status(500).json({
      error: 'Failed to fetch trading data'
    });
  }
};

const verifyBalance = async (userId, expectedBalance) => {
  try {
    // Use BalanceModel pattern from balanceController.js
    const positions = await BalanceModel.findPositionsForUser(userId);

    if (!positions) {
      console.error('No positions found for user:', userId);
      return false;
    }

    // Calculate total profit and commission as per balance.md requirements
    const { totalProfit, totalCommission } = positions.reduce((acc, pos) => ({
      totalProfit: acc.totalProfit + (pos.realProfit || 0),
      totalCommission: acc.totalCommission + (pos.commission || 0)
    }), { totalProfit: 0, totalCommission: 0 });

    // Calculate balance using formula from balance.md
    const calculatedBalance = global.initialBalance + totalProfit - totalCommission;

    // Verify with tolerance of 0.001 as specified
    return Math.abs(calculatedBalance - expectedBalance) < 0.001;
  } catch (error) {
    console.error('Error in verifyBalance:', error);
    return false;
  }
};

const updateEquity = (balance, openPositions, currentPrices) => {
  const unrealizedPnL = openPositions.reduce((acc, pos) => {
    const currentPrice = currentPrices[pos.symbolName];
    if (!currentPrice) return acc;

    const pipSize = 0.0001;
    const direction = pos.type === 'Buy' ? 1 : -1;
    const priceDiff = (currentPrice - pos.startPrice) * direction;
    const positionPnL = (priceDiff / pipSize) * pos.size * pos.leverage - pos.commission;

    return acc + positionPnL;
  }, 0);

  return balance + unrealizedPnL;
};

const calculateMargin = (position, symbolInfo) => {
  try {
    // Handle zero leverage case as per margin.md
    if (!position.leverage || position.leverage === 0) {
      return 0;
    }

    // Use margin formula from indices.md
    const margin = (position.size * position.startPrice) / position.leverage;
    return Number(margin.toFixed(2));
  } catch (error) {
    console.error('Error calculating margin:', error);
    return 0;
  }
};

const checkStopLoss = (position, currentPrice) => {
  if (!position.stopLoss) return false;
  return position.type === 'Buy'
    ? currentPrice <= position.stopLoss
    : currentPrice >= position.stopLoss;
};

const checkTakeProfit = (position, currentPrice) => {
  if (!position.takeProfit) return false;
  return position.type === 'Buy'
    ? currentPrice >= position.takeProfit
    : currentPrice <= position.takeProfit;
};

const checkBuyStopOrder = (order, currentPrice) => {
  return order.type === 'BuyStop' && currentPrice >= order.stopPrice;
};

const checkBuyLimitOrder = (order, currentPrice) => {
  return order.type === 'BuyLimit' && currentPrice <= order.limitPrice;
};

const checkSellStopOrder = (order, currentPrice) => {
  return order.type === 'SellStop' && currentPrice <= order.stopPrice;
};

const checkSellLimitOrder = (order, currentPrice) => {
  return order.type === 'SellLimit' && currentPrice >= order.limitPrice;
};

console.log('Exporting trade controller functions:', {
  createPosition: typeof createPosition,
  closePosition: typeof closePosition,
  getAllPosition: typeof getAllPosition,
  updatePosition: typeof updatePosition,
  getSymbols: typeof getSymbols,
  getTradingDatas: typeof getTradingDatas
});

module.exports = {
  createPosition,
  closePosition,
  checkPosition,
  getAllPosition,
  updatePosition,
  getSymbols,
  getTradingDatas,
  verifyBalance,
  updateEquity,
  calculateMargin,
  checkStopLoss,
  checkTakeProfit,
  checkBuyStopOrder,
  checkBuyLimitOrder,
  checkSellStopOrder,
  checkSellLimitOrder
};
