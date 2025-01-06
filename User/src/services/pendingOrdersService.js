import axios from 'axios';
import { BackendEndpoint } from '../config';

class PendingOrdersService {
    async placeOrder(orderDetails) {
        try {
            const response = await axios.post(`${BackendEndpoint}/orders/pending`, orderDetails, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tradeToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to place pending order');
        }
    }

    async cancelOrder(orderId) {
        try {
            const response = await axios.delete(`${BackendEndpoint}/orders/pending/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tradeToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to cancel pending order');
        }
    }

    async getOrders() {
        try {
            const response = await axios.get(`${BackendEndpoint}/orders/pending`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tradeToken')}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch pending orders');
        }
    }
}

export const pendingOrdersService = new PendingOrdersService();
