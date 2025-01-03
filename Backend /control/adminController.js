const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const {
  Api,
  User,
  Positions,
  Symbols,
  Assets,
  Company,
  Companyuser,
  Commission,
  Leverage,
  Formula
} = require('../models');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const symbols = require('../models/symbols');
const company = require('../models/company');
const positions = require('../models/positions');
const secretKey = 'tradeSecretKey';
const crypto = require('crypto');
const { calculateAnyPairUSD, calculateUSDAnyPair, calculateUSDJPY, calculateJPYAnyPair, calculateAnyAnyConverted, calculateIndices, calculateCryptoUSD, calculateCryptoCrypto, calculateMetalsToUSD } = require('../utils/function');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ where: { email: email } });
    if (company) {
      if (company.role != 'Admin') {
        return res
          .status(401)
          .json({ state: false, message: 'Invaild company' });
      }
      const result = await bcrypt.compare(password, company.password);
      if (result) {
        const payload = { id: company.id, password: company.password };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        await Company.update({ token: token }, { where: { id: company.id } });
        return res.status(200).json({ state: true, token: token });
      } else {
        return res
          .status(401)
          .json({ state: false, message: 'Invalid Company' });
      }
    } else {
      return res.status(401).json({ state: false, message: 'Invalid Company' });
    }
  } catch (error) {
    return res.status(500).json({
      state: false,
      message: 'An error occurred during authentication.'
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const token = req.headers.authorization || '';
    const decodedToken = jwt.verify(token, secretKey);
    const company = await Companyuser.findAll({ attributes: ['email'] });
    const originCompany = await Company.findOne({
      where: { id: decodedToken.id }
    });
    // const users = await User.findAll({ where: { companyEmail: originCompany.email } });

    const users = await User.findAll();

    console.log('users');
    console.log(users);

    const companyEmail = company.map((item) => item.email);
    return res.status(200).send({ users: users, companyEmail: companyEmail });
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'An error occurred while fetching users.' });
  }
};

exports.getUsersByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const users = await User.findAll({ where: { companyEmail: email } });

    return res.status(200).send({ users: users });
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'An error occurred while fetching users.' });
  }
};

exports.getAPIs = async (req, res) => {
  try {
    const apis = await Api.findAll();
    console.log(apis);
    return res.status(200).send({ apis: apis });
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'An error occurred while fetching users.' });
  }
};

exports.createUserOfCompany = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      plan,
      balance,
      drawdown,
      leverage,
      type,
      api_key
    } = req.body;
    // console.log("api key");
    // console.log(req.body);

    const company = await Companyuser.findOne({ where: { api_key: api_key } });
    if (!company) {
      return res
        .status(500)
        .send({ message: 'An error occurred while creating user' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdAt = Date.now();
    const SameUser = await User.findOne({
      where: { email: email, company_id: company.id }
    });
    if (SameUser) {
      // if (SameUser.type == type) {
      return res.status(500).send({ message: 'The user already existed!' });
      // }
    }
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      balance: balance,
      usedMargin: 0,
      allow: 'Allow',
      token: jwt.sign({ hashedPassword }, secretKey),
      companyEmail: company.email,
      type: type,
      createdAt: createdAt,
      plan: plan,
      drawdown: drawdown,
      leverage: leverage
    });
    user.save();
    return res.status(200).send({ message: 'created successfully' });
  } catch (err) {
    console.log('this is a err', err);
    return res
      .status(500)
      .send({ message: 'An error occurred while creating user' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, balance, equity, leverage, companyEmail, type } =
      req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);
    const createdAt = Date.now();
    const SameUser = await User.findOne({ where: { email: email } });
    // if (SameUser) {
    //   if (SameUser.type == type) {
    //     return res.status(500).send({ message: 'The user already existed!' });
    //   }
    // }
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      balance: balance,
      equity: equity,
      leverage: leverage,
      usedMargin: 0,
      allow: 'Allow',
      token: jwt.sign({ hashedPassword }, secretKey),
      companyEmail: companyEmail,
      type: type,
      createdAt: createdAt
    });
    user.save();
    return res.status(200).send({ message: 'created successfully', user });
  } catch (err) {
    console.log('this is a err', err);
    return res
      .status(500)
      .send({ message: 'An error occurred while creating user' });
  }
};

exports.createAPI = async (req, res) => {
  try {
    const { api } = req.body;
    const SameApi = await Api.findOne({ where: { api: api } });
    if (SameApi) {
      if (SameApi.api === api) {
        return res.status(500).send({ message: 'The api already existed!' });
      }
    }
    const item = await Api.create({
      api: api,
      type: true
    });
    item.save();
    return res.status(200).send({ message: 'created successfully' });
  } catch (err) {
    console.log('this is a err', err);
    return res
      .status(500)
      .send({ message: 'An error occurred while creating api' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      password,
      balance,
      equity,
      leverage,
      allow,
      usedMargin,
      companyEmail
    } = req.body;
    const saltRounds = 10;
    let hashedPassword = '';
    if (password.length) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } else {
      hashedPassword = await bcrypt.hash('123456', saltRounds);
    }
    const updatedAt = Date.now();
    const user = await User.update(
      {
        name: name,
        email: email,
        password: hashedPassword,
        balance: balance,
        equity: equity,
        leverage: leverage,
        usedMargin: usedMargin,
        allow: allow,
        companyEmail: companyEmail,
        updatedAt: updatedAt
      },
      { where: { id: userId } }
    );
    return res
      .status(200)
      .send({ message: 'Updating successfully', updatedOne: user });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while updating user' });
  }
};

exports.updateAPI = async (req, res) => {
  try {
    const { id, api, type } = req.body;
    const user = await Api.update(
      {
        api: api,
        type: type
      },
      { where: { id: id } }
    );
    return res
      .status(200)
      .send({ message: 'Updating successfully', updatedOne: user });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).send({ message: 'Cannot find the user' });
    }
    await User.destroy({ where: { id: userId } });
    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'An error occurred while deleting the user.' });
  }
};

exports.deleteAPI = async (req, res) => {
  const { id } = req.body;
  try {
    const item = await Api.findOne({ where: { id: id } });
    if (!item) {
      return res.status(404).send({ message: 'Cannot find the api' });
    }
    await Api.destroy({ where: { id: id } });
    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'An error occurred while deleting the user.' });
  }
};

exports.getSymbols = async (req, res) => {
  try {
    const symbols = await Symbols.findAll();
    const assets = await Assets.findAll({
      include: [{ model: Formula, as: "formula" }],
    });

    // Extract asset names and their associated formulas
    const assetNames = assets.map((item) => ({
      name: item.name,
      formulas: item.formula.map((f) => ({
        id: f.id,
        name: f.name,
        formula: f.formula,
        pip_size: f.pip_size,
      })),
    }));

    return res.status(200).send({ symbols: symbols, assetNames: assetNames });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: 'An error occurred while fetching symbols' });
  }
};

exports.updateSymbol = async (req, res) => {
  try {
    const { name, type, code, assetName, symbolId, formulaName } = req.body;
    const updatedAt = Date.now();
    const symbol = await Symbols.update(
      {
        name: name,
        type: type,
        code: code,
        assetName: assetName,
        formulaName: formulaName,
        updatedAt: updatedAt
      },
      { where: { id: symbolId } }
    );
    return res.status(200).send({ message: 'Edit symbol successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while editing symbol' });
  }
};

exports.createSymbol = async (req, res) => {
  try {
    const { name, type, code, assetName, formulaName } = req.body;
    const createdAt = Date.now();
    const symbol = await Symbols.create({
      name: name,
      type: type,
      code: code,
      assetName: assetName,
      formulaName: formulaName,
      createdAt: createdAt
    });
    symbol.save();
    return res.status(200).send({ message: 'Create symbol successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while creating symbol' });
  }
};

exports.deleteSymbol = async (req, res) => {
  try {
    const { symbolId } = req.body;
    const symbol = await Symbols.findOne({ where: { id: symbolId } });
    if (!symbol) {
      return res.status(404).send({ message: 'Cannot find the user' });
    }
    await Symbols.destroy({ where: { id: symbolId } });
    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occurred while deleting symbol' });
  }
};

exports.getAssets = async (req, res) => {
  try {
    const assets = await Assets.findAll({
      include: [{ model: Formula, as: "formula" }],
    });
    return res.status(200).send({ assets });
  } catch (err) {
    return res.status(500).send({ message: 'An error occurred while fetching assets', error: err.message });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { name, pip_size, assetId } = req.body;
    const updatedAt = Date.now();
    await Assets.update(
      { name: name, pip_size: pip_size, updatedAt: updatedAt },
      { where: { id: assetId } }
    );
    return res.status(200).send({ message: 'Edit symbol successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while editing Assets' });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const { name, pip_size } = req.body;
    const createdAt = Date.now();
    const asset = await Assets.create({
      name: name,
      pip_size: pip_size,
      createdAt: createdAt
    });
    asset.save();
    return res.status(200).send({ message: 'Create symbol successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while creating Assets', err });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const { assetId } = req.body;
    const asset = await Assets.findOne({ where: { id: assetId } });
    if (!asset) {
      return res.status(404).send({ message: 'Cannot find the user' });
    }
    await Assets.destroy({ where: { id: assetId } });
    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occurred while deleting symbol' });
  }
};

exports.getPositions = async (req, res) => {
  console.log('Route hit');
  try {
    const token = req.headers.authorization || '';

    if (!token) {
      return res
        .status(401)
        .send({ message: 'Authorization token is required' });
    }
    console.log('Hello token', token);
    console.log('Hello secretKey', secretKey);
    const decodedToken = jwt.verify(token, secretKey);
    const originCompany = await Company.findOne({
      where: { id: decodedToken.id }
    });

    if (!originCompany) {
      return res.status(404).send({ message: 'Company not found' });
    }

    const users = await User.findAll({
      where: { companyEmail: originCompany.email }
    });
    const userIds = users.map((user) => user.id);

    const positions = await Positions.findAll({
      where: {
        userId: userIds
      }
    });

    return res.status(200).send({ positions });
  } catch (err) {
    console.error('Error fetching positions:', err);
    return res
      .status(500)
      .send({ message: 'An error occurred', error: err.message });
  }
};

exports.getCompaniesUser = async (req, res) => {
  try {
    const companiesuser = await Companyuser.findAll();
    return res.status(200).send({ companiesuser: companiesuser });
  } catch (err) {
    return res
      .status(200)
      .send({ message: 'An error occurred while fetching companies' });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    return res.status(200).send({ companies: companies });
  } catch (err) {
    return res
      .status(200)
      .send({ message: 'An error occurred while fetching companies' });
  }
};

exports.createCompanyUser = async (req, res) => {
  try {
    const { email, name, url } = req.body;
    // let hashedPassword = '';
    // const saltRounds = 10;
    // if (password.length) {
    //     hashedPassword = await bcrypt.hash(password, saltRounds);
    // } else {
    //     hashedPassword = await bcrypt.hash('123456', saltRounds);
    // }

    const SameUser = await Companyuser.findOne({ where: { email: email } });
    if (SameUser) {
      if (SameUser.type == type) {
        return res
          .status(500)
          .send({ message: 'The company email already existed!' });
      }
    }

    const company = await Companyuser.create({
      email: email,
      url: url,
      name: name,
      end_point: 'google.com',
      api_key: crypto.randomBytes(32).toString('hex')
    });

    company.save();
    return res.status(200).send({ message: 'Company created successfully' });
  } catch (err) {
    return res
      .status(200)
      .send({ message: 'An error occurred while creating companies' });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let hashedPassword = '';
    const saltRounds = 10;
    if (password.length) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } else {
      hashedPassword = await bcrypt.hash('123456', saltRounds);
    }
    const company = await Company.create({
      email: email,
      password: hashedPassword,
      role: role
    });
    company.save();
    return res.status(200).send({ message: 'Company created successfully' });
  } catch (err) {
    return res
      .status(200)
      .send({ message: 'An error occurred while creating companies' });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { companyId, email, password, role } = req.body;
    const saltRounds = 10;
    let hashedPassword = '';
    if (password.length) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } else {
      hashedPassword = await bcrypt.hash('123456', saltRounds);
    }
    const updatedAt = Date.now();
    await Company.update(
      {
        password: hashedPassword,
        email: email,
        role: role,
        updatedAt: updatedAt
      },
      { where: { id: companyId } }
    );
    return res.status(200).send({ message: 'Updating successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while updating company' });
  }
};

exports.updateCompanyUser = async (req, res) => {
  try {
    const { name, email, url, companyUserId } = req.body;
    // const saltRounds = 10;
    // let hashedPassword = '';
    // if (password.length) {
    //     hashedPassword = await bcrypt.hash(password, saltRounds);
    // } else {
    //     hashedPassword = await bcrypt.hash("123456", saltRounds);
    // }
    // const updatedAt = Date.now();
    await Companyuser.update(
      { email: email, name: name, url: url },
      { where: { id: companyUserId } }
    );
    return res.status(200).send({ message: 'Updating successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while updating company' });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const company = await Company.findOne({ where: { id: companyId } });
    if (!company) {
      return res.status(404).send({ message: 'Cannot find the company' });
    }
    await Company.destroy({ where: { id: companyId } });
    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occurred while deleting company' });
  }
};

exports.deleteCompanyUser = async (req, res) => {
  try {
    const { companyUserId } = req.body;
    const company = await Companyuser.findOne({ where: { id: companyUserId } });
    if (!company) {
      return res.status(404).send({ message: 'Cannot find the company' });
    }
    await Companyuser.destroy({ where: { id: companyUserId } });
    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occurred while deleting company' });
  }
};

exports.getCommissions = async (req, res) => {
  try {
    const token = req.headers.authorization || '';
    const decodedToken = jwt.verify(token, secretKey);
    const originCompany = await Company.findOne({
      where: { id: decodedToken.id }
    });
    const commissions = await Commission.findAll({
      where: { companyEmail: originCompany.email }
    });
    return res.status(200).send({ commissions: commissions });
  } catch (err) {
    return res
      .status(200)
      .send({ message: 'An error occurred while fetching commissions' });
  }
};

exports.updateCommission = async (req, res) => {
  try {
    const { companyEmail, Forex, Indices, Crypto, Futures, commissionId } =
      req.body;
    const updatedAt = Date.now();
    await Commission.update(
      {
        companyEmail: companyEmail,
        Forex: Forex,
        Indices: Indices,
        Crypto: Crypto,
        Futures: Futures,
        updatedAt: updatedAt
      },
      { where: { id: commissionId } }
    );
    return res.status(200).send({ message: 'Edit commission successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while editing commission' });
  }
};

exports.createCommission = async (req, res) => {
  try {
    const { companyEmail, Forex, Indices, Crypto, Futures } = req.body;
    const createdAt = Date.now();
    const commission = await Commission.create({
      companyEmail: companyEmail,
      Forex: Forex,
      Indices: Indices,
      Crypto: Crypto,
      Futures: Futures,
      createdAt: createdAt
    });
    commission.save();
    return res.status(200).send({ message: 'Create Commission successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while creating Commission', err });
  }
};

exports.deleteCommission = async (req, res) => {
  try {
    const { commissionId } = req.body;
    const commission = await Commission.findOne({
      where: { id: commissionId }
    });
    if (!commission) {
      return res.status(404).send({ message: 'Cannot find the user' });
    }
    await Commission.destroy({ where: { id: commissionId } });
    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occurred while deleting commission' });
  }
};

exports.getLeverages = async (req, res) => {
  try {
    const token = req.headers.authorization || '';
    const decodedToken = jwt.verify(token, secretKey);
    const originCompany = await Company.findOne({
      where: { id: decodedToken.id }
    });
    const leverage = await Leverage.findAll({
      where: { companyEmail: originCompany.email }
    });
    return res.status(200).send({ leverages: leverage });
  } catch (err) {
    console.log('GetLeveraged | ', err);
    return res
      .status(500)
      .send({ message: 'An error occurred while fetching leverages' });
  }
};

exports.updateLeverage = async (req, res) => {
  try {
    const { companyEmail, Forex, Indices, Crypto, Futures, leverageId } =
      req.body;
    const updatedAt = Date.now();
    await Leverage.update(
      {
        companyEmail: companyEmail,
        Forex: Forex,
        Indices: Indices,
        Crypto: Crypto,
        Futures: Futures,
        updatedAt: updatedAt
      },
      { where: { id: leverageId } }
    );
    return res.status(200).send({ message: 'Edit leverage successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while editing leverage' });
  }
};

exports.createLeverage = async (req, res) => {
  try {
    const { companyEmail, Forex, Indices, Crypto, Futures } = req.body;
    const createdAt = Date.now();
    const leverage = await Leverage.create({
      companyEmail: companyEmail,
      Forex: Forex,
      Crypto: Crypto,
      Indices: Indices,
      Futures: Futures,
      createdAt: createdAt
    });
    leverage.save();
    return res.status(200).send({ message: 'Create Leverage successfully' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occured while creating Leverage', err });
  }
};

exports.deleteLeverage = async (req, res) => {
  try {
    const { leverageId } = req.body;
    const leverage = await Leverage.findOne({ where: { id: leverageId } });
    if (!leverage) {
      return res.status(404).send({ message: 'Cannot find the leverage' });
    }
    await Leverage.destroy({ where: { id: leverageId } });
    return res.status(200).send({ message: 'Successfully deleted' });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occurred while deleting leverage' });
  }
};

exports.getUserAPIs = async (req, res) => {
  try {
    const apis = await Api.findAll();
    return res.status(200).json({ apis });
  } catch (error) {
    console.error('Error in getUserAPIs:', error);
    return res.status(500).json({
      message: 'An error occurred while fetching APIs.'
    });
  }
};

//###### formula

exports.getFormula = async (req, res) => {
  try {
    const formula = await Formula.findAll();
    return res.status(200).send({ formulas: formula });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'An error occurred while fetching Formula' });
  }
};


exports.getFormulaCalculate = async (req, res) => {
  const accountDetails = {
    balance: 10000, // Account balance in USD
    leverage: 100, // 1:100 leverage
    lotSize: 1, // Standard lot = 100,000 units
  };

  function calculateMargin(symbolPrice, lotSize, leverage) {
    return (symbolPrice * lotSize * 100000) / leverage;
  }

  function calculatePipValue(symbolPrice, lotSize) {
    return (lotSize * 100000 * 0.0001) / symbolPrice;
  }

  const order = {
    action: 'BUY',
    symbol: 'EUR/USD',
    lotSize: accountDetails.lotSize,
  };

  const price = 1.1000; // Example market price for EUR/USD
  const marginRequired = calculateMargin(price, accountDetails.lotSize, accountDetails.leverage);
  const pipValue = calculatePipValue(price, accountDetails.lotSize);

  if (accountDetails.balance >= marginRequired) {
    console.log(`Placing order: ${JSON.stringify(order)}`);
    console.log(`Margin Required: $${marginRequired.toFixed(2)}`);
    console.log(`Pip Value: $${pipValue.toFixed(2)}`);
    return res.status(200).send({ "Placing_order": order, "Margin_Required": marginRequired.toFixed(2), "Pip_Value": pipValue.toFixed(2) });
  } else {
    console.log('Insufficient funds to place this trade.');
    return res.status(200).send({ marginRequired, pipValue })
  }
};

exports.getPLCalculate = async (req, res) => {
  try {
    const {
      entryPrice,
      exitPrice,
      lotSize,
      quotePrice,
      conversionRate,
      leverage,
      pointValue
    } = req.body;

    // Perform calculations for each scenario
    const results = {
      anyPairUSD: calculateAnyPairUSD(entryPrice, exitPrice, lotSize, quotePrice, leverage),
      usdAnyPair: calculateUSDAnyPair(entryPrice, exitPrice, lotSize, leverage),
      usdJPY: calculateUSDJPY(entryPrice, exitPrice, lotSize, leverage),
      jpyAnyPair: calculateJPYAnyPair(entryPrice, exitPrice, lotSize, quotePrice, leverage),
      anyAnyConverted: calculateAnyAnyConverted(entryPrice, exitPrice, lotSize, conversionRate, leverage),
      indices: calculateIndices(entryPrice, exitPrice, lotSize, pointValue, leverage),
      cryptoUSD: calculateCryptoUSD(entryPrice, exitPrice, lotSize, leverage),
      cryptoCrypto: calculateCryptoCrypto(entryPrice, exitPrice, lotSize, conversionRate, leverage),
      metalsToUSD: calculateMetalsToUSD(entryPrice, exitPrice, lotSize, leverage)
    };

    res.status(200).json({
      success: true,
      message: "P/L and Margin calculations completed successfully.",
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating P/L and Margin.",
      error: error.message
    });
  }
};










// Create a new asset
// exports.createAsset = async (req, res) => {
//   try {
//     const { name, pip_size, formulas } = req.body;

//     const asset = await Assets.create({ name, pip_size });

//     // If formulas are provided, bulk create them and associate them with the asset
//     if (formulas && Array.isArray(formulas)) {
//       const formulaData = formulas.map((formula) => ({
//         ...formula,
//         assetId: asset.id,
//       }));
//       await Formula.bulkCreate(formulaData);
//     }

//     return res.status(200).send({ message: 'Asset created successfully', asset });
//   } catch (err) {
//     return res.status(500).send({ message: 'An error occurred while creating the asset', error: err.message });
//   }
// };

// Delete an asset by ID
// exports.deleteAsset = async (req, res) => {
//   try {
//     const { assetId } = req.body;

//     const asset = await Assets.findByPk(assetId);
//     if (!asset) {
//       return res.status(404).send({ message: 'Asset not found' });
//     }

//     await asset.destroy(); // Automatically deletes associated formulas if cascade is enabled
//     return res.status(200).send({ message: 'Asset deleted successfully' });
//   } catch (err) {
//     return res.status(500).send({ message: 'An error occurred while deleting the asset', error: err.message });
//   }
// };
