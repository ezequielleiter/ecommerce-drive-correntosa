import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession, IronSessionData } from 'iron-session/edge';
import configs from '../constants/config';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const ironSession: IronSessionData = await getIronSession(req, res, {
		password: configs.IRON_SESSIONS_PASSWORD,
		cookieName: 'almargen_app',
		cookieOptions: {
			secure: false
		}
	});

	const isLogged = ironSession.user;

	if (req.nextUrl.pathname.startsWith('/api/login') || req.nextUrl.pathname.startsWith('/api/oauthcallback')) {
		return NextResponse.next();
	}

	if (req.nextUrl.pathname.startsWith('/admin') && !isLogged) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	if (req.nextUrl.pathname.startsWith('/api') && !isLogged) {
		return NextResponse.json({ message: 'Auth required' }, { status: 401 });
	}

	if (
		(req.nextUrl.pathname.startsWith('/api/admin') || req.nextUrl.pathname.startsWith('/admin')) &&
		!ironSession.user.isAdmin && !ironSession.user.isSuperAdmin
	) {
		return NextResponse.json({ message: 'Forbidden. Must be admin' }, { status: 401 });
	}

	return NextResponse.next();
}
