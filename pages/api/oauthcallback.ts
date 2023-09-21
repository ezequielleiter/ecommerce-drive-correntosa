import { container } from 'tsyringe';
import GoogleAuthService from '../../src/services/GoogleAuthService';
import { Credentials } from 'google-auth-library';
import { oauth2_v2 } from 'googleapis';
import Schema$Userinfo = oauth2_v2.Schema$Userinfo;
import { withSessionRoute } from '../../src/utils/withIronSession';
import GoogleSheetService from '../../src/services/GoogleSheetService';
import { NextApiRequest, NextApiResponse } from 'next';
import config from '../../constants/config';

const oauthCallback = async (req: NextApiRequest, res: NextApiResponse) => {
	const googleAuth = container.resolve(GoogleAuthService);

	try {
		const code = req.query.code;

		if (!code) {
			res.json({ error: true, message: 'code doesnt exists' });
		}
		/* Get Profile from Google OAuth2*/
		const clientCredentials: Credentials = await googleAuth.getUserTokens(code);
		const profile: Schema$Userinfo = await googleAuth.getProfileInfo(clientCredentials);

		/* Get User's List from Google Sheet*/
		const googleSheetInstance = new GoogleSheetService('users');
		const users: Array<Array<string>> = await googleSheetInstance.getGoogleSheetData();

		const MatchEmail = users.find(user => user[config.GOOGLE_SHEET_ROWS.USERS.EMAIL_COLUMN] === profile.email);

		if (!MatchEmail) {
			res.redirect('/#unauthorized');
		} else {
			req.session.user = {
				id_google_sheet: profile.id,
				id: MatchEmail[config.GOOGLE_SHEET_ROWS.USERS.ID_COLUMN],
				name: profile.name,
				email: profile.email,
				profile_picture: profile.picture,
				logged: true,
				isAdmin: MatchEmail[config.GOOGLE_SHEET_ROWS.USERS.IS_ADMIN_COLUMN] === '1',
				isSuperAdmin: MatchEmail[config.GOOGLE_SHEET_ROWS.USERS.IS_ADMIN_COLUMN] === '2'
			};

			await req.session.save();
			if (MatchEmail[config.GOOGLE_SHEET_ROWS.USERS.IS_ADMIN_COLUMN] === '1') {
				return res.redirect('/admin#logged');
			}
			res.redirect('/compras-activas');
		}
	} catch (e) {
		res.json(e);
	}
};

export default withSessionRoute(oauthCallback);
