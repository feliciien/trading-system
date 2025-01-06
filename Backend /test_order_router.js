const express = require('express');
const router = express.Router();
const { OrderController } = require('./control/orderController');

// Initialize controller
const orderController = new OrderController();

// Print methods
console.log('OrderController instance:', orderController);
console.log('OrderController methods:', {
    createPendingOrder: orderController.createPendingOrder,
    getPendingOrders: orderController.getPendingOrders,
    cancelPendingOrder: orderController.cancelPendingOrder,
    verifyTakeProfit: orderController.verifyTakeProfit,
    executeTakeProfit: orderController.executeTakeProfit
});
