import { container } from 'tsyringe';
import ConfigService from '../services/ConfigService';
import { getIronSession, IronSessionData } from 'iron-session';
import { sessionOptions } from '../utils/withIronSession';
import { UserLogged } from '../global/types';
import OrderService from '../services/OrderService';

export async function getServerSideProps(context) {
	const configService = container.resolve(ConfigService);
	// const getIsOpen = await configService.getCartStatus();
	const ironSession: IronSessionData = await getIronSession(context.req, context.res, sessionOptions);

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

	if (ironSession.user) {
		const orderService = container.resolve(OrderService);
		// const ModelResponse = await orderService.getUserOrder(ironSession.user.email);
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
		return {
			redirect: {
				permanent: false,
				destination: '/compras-activas'
			},
			props: { cart, user: { logged: false } }
		};
	}

	const user: UserLogged = ironSession.user ?? { logged: false };
	return { props: { user, cart } };
}
