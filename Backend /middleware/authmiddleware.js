const jwt = require('jsonwebtoken');
const { User } = require('../models');
const secretKey = 'tradeSecretKey';

console.log('Loading authmiddleware...');

exports.authmiddleware = async (req, res, next) => {
    console.log('Auth middleware called with headers:', {
        authorization: req.headers.authorization ? 'present' : 'missing'
    });
    
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            console.log('No token provided in request');
            return res.status(401).json({ message: 'No token provided' });
        }

        console.log('Attempting to verify token...');
        const decoded = jwt.verify(token, secretKey);
        console.log('Token decoded:', { userId: decoded.id });

        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            console.log('No user found for decoded token ID:', decoded.id);
            return res.status(401).json({ message: 'User not found' });
        }

        console.log('User authenticated successfully:', { userId: user.id });
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        return res.status(401).json({ message: 'Invalid token' });
    }
};