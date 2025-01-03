const express = require('express');
const router = express.Router();
const { getAllPosition } = require('../control/tradeController');

// Simple in-memory rate limiting
const requestTimestamps = new Map();
const RATE_LIMIT_WINDOW = 5000; // 5 seconds

router.get('/equity/updates', async (req, res, next) => {
    const now = Date.now();
    const clientIp = req.ip;
    const lastRequest = requestTimestamps.get(clientIp) || 0;

    if (now - lastRequest < RATE_LIMIT_WINDOW) {
        return res.status(429).json({
            error: 'Too many requests, please wait 5 seconds'
        });
    }

    requestTimestamps.set(clientIp, now);
    
    try {
        const result = await getAllPosition(req, res);
        return result;
    } catch (error) {
        next(error);
    }
});

module.exports = router;