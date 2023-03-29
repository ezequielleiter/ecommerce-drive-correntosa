import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';

import config from '../../constants/config';

declare module 'iron-session' {
	interface IronSessionData {
		user?: {
			id_google_sheet?: string;
			id?: string;
			name?: string;
			email?: string;
			profile_picture?: string;
			logged?: boolean;
			isAdmin?: boolean;
			isSuperAdmin?: boolean;
		};
	}
}

export const sessionOptions = {
	password: config.IRON_SESSIONS_PASSWORD,
	cookieName: 'almargen_app',
	cookieOptions: {
		secure: false
	}
};

export function withSessionRoute(handler: NextApiHandler) {
	return withIronSessionApiRoute(handler, sessionOptions);
}
