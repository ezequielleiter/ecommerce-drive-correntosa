import { container } from 'tsyringe';
import { getIronSession, IronSessionData } from 'iron-session';
import { UserLogged } from '../global/types';
import { sessionOptions } from '../utils/withIronSession';
import OrderService from '../services/OrderService';
import ConfigService from '../services/ConfigService';

export async function getServerSideProps(context) {
	const orderService = container.resolve(OrderService);
	const configService = container.resolve(ConfigService);
	const ironSession: IronSessionData = await getIronSession(context.req, context.res, sessionOptions);
	const user: UserLogged = ironSession.user ?? { logged: false };

	const cart = { products: [], total: 0 };

	if (ironSession.user && !ironSession.user.id) {
		context.req.session.destroy();
		return {
			redirect: {
				permanent: false,
				destination: '/'
			},
			props: {}
		};
	}

	if (user.logged) {
		const orderService = container.resolve(OrderService);
		// const ModelResponse = await orderService.getUserOrder(user.email);
		// if (ModelResponse) {
		// 	cart.products = ModelResponse.products.map(({ code, name, price, minimum, qty, total, picture }) => ({
		// 		code,
		// 		name,
		// 		price,
		// 		minimum,
		// 		qty,
		// 		total,
		// 		picture
		// 	}));
		// 	cart.total = cart.products.reduce((total, product) => total + product.total, 0);
		// }
	}

	// const currentStatus = await configService.getCartStatus();
	const allSales = await configService.getAllSales();
	const currentOrders = await orderService.getCurrentOrders();

	return {
		props: { user, currentOrders, cart, allSales }
	};
}
