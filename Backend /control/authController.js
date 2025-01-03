const { User, Api } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'tradeSecretKey';

// Add a test function to verify password hashing
const testPasswordHash = async () => {
  const testPassword = 'admin123';
  const hashedPassword = '$2b$10$D0o4BIrej7SMultfnHL3eOiywrJJ8WZ8j8BhoJrG0N9OrTSgNsuNa';
  const isValid = await bcrypt.compare(testPassword, hashedPassword);
  console.log('Password test:', { testPassword, isValid });
};

// Call the test function
testPasswordHash();

// Add a function to generate a password hash
const generateHash = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash for testing:', hash);
  return hash;
};

// Generate hash for 'admin123'
generateHash('admin123');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  try {
    const user = await User.findOne({ where: { email } });
    console.log('User found:', user ? { id: user.id, email: user.email, type: user.type } : null);
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ state: false, message: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', { isValid });
    
    if (!isValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ state: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '24h' });
    await User.update({ token }, { where: { id: user.id } });
    
    console.log('Login successful for user:', { email, type: user.type });
    return res.status(200).json({ 
      state: true, 
      token,
      type: user.type
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      state: false,
      message: 'An error occurred during authentication.'
    });
  }
};

exports.getUserAPIs = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            console.error('No user found in request');
            return res.status(401).json({
                message: 'User not authenticated'
            });
        }
        
        console.log('Attempting to fetch APIs for user:', {
            id: user.id,
            email: user.email,
            companyEmail: user.companyEmail
        });
        
        const apis = await Api.findAll();
        console.log('Found APIs:', apis);

        return res.status(200).json({ apis });
    } catch (error) {
        console.error('Error in getUserAPIs:', {
            name: error.name,
            message: error.message,
            sql: error.sql,
            sqlMessage: error.parent?.sqlMessage
        });
        return res.status(500).json({ 
            message: 'An error occurred while fetching APIs.'
        });
    }
};

Api.migrate = async () => {
  // const count = await User.count();

  // if (!count) {
  await Api.destroy({ truncate: true });

  await Api.create({
    id: 1,
    api: 'wsaVL02X4vyjgU1DMatg'
  });
  await Api.create({
    id: 2,
    api: 'wsJ40TGsE4xf5ABWPy7Q'
  });
  await Api.create({
    id: 3,
    api: 'wsp44Clhx5d1HwD_WBCA'
  });
  // }
};

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, secretKey);
        console.log('Decoded token:', decoded);

        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};