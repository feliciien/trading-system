const { Positions, User } = require('../models');

class OrderController {
    async createPendingOrder(req, res) {
        try {
            const { type, price, stopLoss, takeProfit, lotSize, positionId } = req.body;
            const userId = req.user.id;

            // Validate order details
            if (!type || !price || !lotSize) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required order details'
                });
            }

            // Create pending order
            const order = await Positions.create({
                userId,
                type,
                entryPrice: price,
                stopLoss,
                takeProfit,
                lotSize,
                status: 'pending',
                parentPositionId: positionId
            });

            return res.status(201).json({
                success: true,
                order
            });
        } catch (error) {
            console.error('Create pending order error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create pending order'
            });
        }
    }

    async getPendingOrders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await Positions.findAll({
                where: {
                    userId,
                    status: 'pending'
                }
            });

            return res.json({
                success: true,
                orders
            });
        } catch (error) {
            console.error('Get pending orders error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch pending orders'
            });
        }
    }

    async cancelPendingOrder(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;

            const order = await Positions.findOne({
                where: {
                    id: orderId,
                    userId,
                    status: 'pending'
                }
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Pending order not found'
                });
            }

            await order.destroy();

            return res.json({
                success: true,
                message: 'Order cancelled successfully'
            });
        } catch (error) {
            console.error('Cancel pending order error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to cancel pending order'
            });
        }
    }

    async verifyTakeProfit(req, res) {
        try {
            const { id, currentPrice, takeProfit } = req.body;
            const userId = req.user.id;

            const position = await Positions.findOne({
                where: {
                    id,
                    userId,
                    status: 'open'
                }
            });

            if (!position) {
                return res.status(404).json({
                    success: false,
                    message: 'Position not found'
                });
            }

            // Calculate potential profit
            const pips = Math.abs(takeProfit - currentPrice) * 10000;
            const pipValue = position.type === 'buy' ? 10 : -10; // Simplified pip value calculation
            const potentialProfit = pips * pipValue * position.lotSize;

            return res.json({
                success: true,
                shouldTrigger: currentPrice >= takeProfit,
                profit: potentialProfit
            });
        } catch (error) {
            console.error('Verify take profit error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to verify take profit'
            });
        }
    }

    async executeTakeProfit(req, res) {
        try {
            const { positionId, currentPrice } = req.body;
            const userId = req.user.id;

            const position = await Positions.findOne({
                where: {
                    id: positionId,
                    userId,
                    status: 'open'
                }
            });

            if (!position) {
                return res.status(404).json({
                    success: false,
                    message: 'Position not found'
                });
            }

            // Calculate profit
            const pips = Math.abs(currentPrice - position.entryPrice) * 10000;
            const pipValue = position.type === 'buy' ? 10 : -10; // Simplified pip value calculation
            const profit = pips * pipValue * position.lotSize;

            // Update position
            await position.update({
                status: 'closed',
                closePrice: currentPrice,
                profit
            });

            // Update user balance
            const user = await User.findByPk(userId);
            await user.update({
                balance: user.balance + profit,
                equity: user.equity + profit
            });

            return res.json({
                success: true,
                position,
                profit
            });
        } catch (error) {
            console.error('Execute take profit error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to execute take profit'
            });
        }
    }
}

module.exports = {
    OrderController
};
