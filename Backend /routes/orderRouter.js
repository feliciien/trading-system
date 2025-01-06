const express = require('express');
const router = express.Router();
const { authmiddleware } = require('../middleware/authmiddleware');
const { OrderController } = require('../control/orderController');

// Initialize controller
const orderController = new OrderController();

// Pending Orders routes
router.post('/pending', authmiddleware, async (req, res) => {
    try {
        await orderController.createPendingOrder(req, res);
    } catch (error) {
        console.error('Create pending order error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/pending', authmiddleware, async (req, res) => {
    try {
        await orderController.getPendingOrders(req, res);
    } catch (error) {
        console.error('Get pending orders error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.delete('/pending/:orderId', authmiddleware, async (req, res) => {
    try {
        await orderController.cancelPendingOrder(req, res);
    } catch (error) {
        console.error('Cancel pending order error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Take Profit routes
router.post('/verify-take-profit', authmiddleware, async (req, res) => {
    try {
        await orderController.verifyTakeProfit(req, res);
    } catch (error) {
        console.error('Verify take profit error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/execute-take-profit', authmiddleware, async (req, res) => {
    try {
        await orderController.executeTakeProfit(req, res);
    } catch (error) {
        console.error('Execute take profit error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
