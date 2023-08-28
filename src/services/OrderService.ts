import { singleton } from 'tsyringe';
import ApiException from '../exceptions/ApiExeption';
import { orderData } from '../global/types';
import Order, { OrderI } from '../models/Order';
import BaseService from './BaseService';

@singleton()
class OrderService extends BaseService {
	constructor() {
		super();
	}

	async saveOrder(order: OrderI) {
		try {
			await Order.createOrder(order);
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getCurrentOrders() {
		try {
			const currentOrders = await Order.getCurrentOrders();
			return JSON.parse(JSON.stringify(currentOrders));
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getUserOrder(email: string) {
		try {
			const userOrder = await Order.getUserOrder(email);

			return userOrder;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getUserOrderBySale(userId: string, saleId: string) {
		try {
			const userOrder = await Order.getUserOrderBySale(userId, saleId);
			return userOrder;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getOrderBySale(saleId: string) {
		try {
			const saleOrders = await Order.getOrderBySale(saleId);
			return saleOrders;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getOrdersByUser(userId: string) {
		try {
			const orders = await Order.getOrdersByUser(userId);
			return orders;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getOrdersToPost() {
		try {
			const orders = await Order.getOrdersToPost();
			return orders;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async updateOrder(orderId: string, order: orderData) {
		try {
			const updatedOrder = await Order.updateOrder(orderId, order);
			return updatedOrder;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async closeOrder(orderId: string, order: orderData) {
		try {
			const closeOrder = await Order.closeOrder(orderId, order);
			return closeOrder;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async clearLocalOrders() {
		try {
			await Order.deleteAllOrders();
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getOrderBySaleAndUser(saleId, userId) {
		try {
			const userOrder = await Order.getOrderBySaleAndUser(saleId, userId);
			return userOrder;
		} catch (e) {
			throw new ApiException(e);
		}
	}
}

export default OrderService;
