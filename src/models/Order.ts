import mongoose, { Schema, model, Document } from 'mongoose';

interface Product {
	code: number;
	name: string;
	price: number;
	minimum: string;
	qty: number;
	total: number;
	picture: string;
	seller: string
}

export interface OrderI {
	userId: string;
	email: string;
	products: Product[];
	total: number;
	saleId: string;
}

interface BaseOrderDocument extends OrderI, Document {}

const Order = new Schema<BaseOrderDocument>(
	{
		userId: 'string',
		email: 'string',
		products: [
			{
				code: 'number',
				name: 'string',
				price: 'number',
				minimum: 'string',
				qty: 'number',
				total: 'number',
				picture: 'string',
				seller: 'string'
			}
		],
		total: 'number',
		saleId: 'string'
	},
	{ timestamps: true }
);

Order.statics.createOrder = async function (order: OrderI) {
	await this.create(order);
};

Order.statics.getCurrentOrders = async function () {
	const orders = await this.find({}).select({ _id: 0, __v: 0, products: 0 });
	const count = orders.length;
	return { orders, count };
};

Order.statics.getUserOrder = async function (email: string) {
	const order = await this.findOne({ email });
	return order;
};

Order.statics.getUserOrderBySale = async function (userId: string, saleId: string) {
	const userorder = await this.find({});
	const userOrderToJSON = JSON.stringify(userorder);
	const userOrderParse = JSON.parse(userOrderToJSON);
	const order = userOrderParse.find(orderByUser => {
		return orderByUser.saleId === saleId.toString() && orderByUser.userId === userId;
	});
	if (!order) {
		const newOrder = {
			userId: "",
			email: "",
			products: [],
			total: 0
		};
	return newOrder
	}
	return order;
};

Order.statics.getOrderBySale = async function (saleId: string) {
	const orders = await this.find({ saleId: saleId.toString()});
	const ordersToJSON = JSON.stringify(orders);
	const orderParse = JSON.parse(ordersToJSON);
	const ordersBySale = orderParse.filter(orderByUser => {
		return orderByUser.saleId === saleId.toString();
	});
	return ordersBySale;
};

Order.statics.getOrdersByUser = async function (userId: string) {
	const orders = await this.find({ userId: userId.toString() });
	const ordersToJSON = JSON.stringify(orders);
	const orderParse = JSON.parse(ordersToJSON);
	const ordersByUser = orderParse.filter(orderByUser => {
		return orderByUser.userId === userId.toString();
	});
	return ordersByUser;
};

Order.statics.getOrdersToPost = async function () {
	const allOrders = await this.find({});
	const formattedOrders = [];
	allOrders.map(order => {
		order.products.map(product => {
			const newOrder = {
				userId: order.userId,
				email: order.email,
				product: product.name,
				code: product.code,
				cantidad: product.qty
			};
			formattedOrders.push(newOrder);
		});
	});
	return formattedOrders;
};

Order.statics.updateOrder = async function (orderId, order) {
	const { products, total } = order;
	const updatedOrder = await this.findByIdAndUpdate(orderId, { products, total }, { new: true });
	return updatedOrder;
};

Order.statics.deleteAllOrders = async function () {
	await this.deleteMany({});
};

if (!mongoose.models.Order) {
	model<BaseOrderDocument>('Order', Order);
}

export default mongoose.models.Order;
