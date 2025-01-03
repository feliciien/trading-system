const { Company, Companyuser } = require('../models');

exports.adminmiddleware = async (req, res, next) => {
  const token = req.headers.authorization || '';
  if (token == '') {
    res.status(401).json({ state: 'No Vailed Token! Please Login Again!' });
    return;
  }
  const company = await Company.findOne({ where: { token } });
  const companyUser = await Companyuser.findOne({ where: { api_key: token } });
  if (!company && !companyUser) {
    res.status(401).json({ state: 'No Vailed Token! Please Login Again!' });
    return;
  }
  next();
};
