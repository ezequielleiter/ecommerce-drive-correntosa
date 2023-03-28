import { sessionOptions } from '../utils/withIronSession';
import { container } from 'tsyringe';
import ConfigService from '../services/ConfigService';
import { getIronSession, IronSessionData } from 'iron-session';
import { UserLogged } from '../global/types';
import OrderService from '../services/OrderService';

export async function getServerSideProps(context) {
	const configService = container.resolve(ConfigService);
	// const getIsOpen = await configService.getCartStatus();
	const ironSession: IronSessionData = await getIronSession(context.req, context.res, sessionOptions);

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

	// if (getIsOpen.status !== 'open' || !ironSession.user) {
	// 	return {
	// 		redirect: {
	// 			permanent: false,
	// 			destination: '/'
	// 		},
	// 		props: {}
	// 	};
	// }

	const user: UserLogged = ironSession.user ?? { logged: false };

	return { props: { user } };
}
