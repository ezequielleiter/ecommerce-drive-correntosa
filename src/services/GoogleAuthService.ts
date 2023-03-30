import config from '../../constants/config';
import { Credentials, GoogleAuth, OAuth2Client } from 'google-auth-library';
import { singleton } from 'tsyringe';
import { google, oauth2_v2 } from 'googleapis';
import Schema$Userinfo = oauth2_v2.Schema$Userinfo;
import BaseService from './BaseService';

@singleton()
class GoogleAuthService extends BaseService {
	public GoogleClient;
	public GoogleAuth;
	public oAuth2Client;

	constructor() {
		super();
		this.oAuth2Client = new OAuth2Client(
			config.gapi.OAUTH_CLIENT_ID,
			config.gapi.OAUTH_CLIENT_KEY,
			config.gapi.OAUTH_REDIRECT_URL
		);
	}

	async startGoogleAuthentification() {
		try {
			const connection = await this.initConnection();
			this.GoogleClient = connection.googleClient;
			this.GoogleAuth = connection.googleAuth;
		} catch (e) {
			throw new Error(`Client Google error ${e}`);
		}
	}

	async initConnection(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const googleAuth = new GoogleAuth({
					credentials: JSON.parse(config.googleCredentials.GOOGLE_CREDENTIALS),
					scopes: config.gapi.SCOPES
				});
				const googleClient = await googleAuth.getClient();
				resolve({ googleClient, googleAuth });
			} catch (e) {
				reject(e);
			}
		});
	}

	getAuthUrl(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				// Generate the url that will be used for the consent dialog.
				const authorizeUrl = this.oAuth2Client.generateAuthUrl({
					access_type: 'offline',
					scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
				});

				resolve(authorizeUrl);
			} catch (e) {
				reject({ error: 'error on url' });
			}
		});
	}

	getUserTokens(code: string | string[]): Promise<Credentials> {
		return new Promise(async (resolve, reject) => {
			try {
				const r = await this.oAuth2Client.getToken(code);

				this.oAuth2Client.setCredentials(r.tokens);
				const tokens: Credentials = r.tokens;

				resolve(tokens);
			} catch (e) {
				reject({ error: e });
			}
		});
	}

	getProfileInfo(credentials: Credentials): Promise<Schema$Userinfo> {
		return new Promise((resolve, reject) => {
			this.oAuth2Client.setCredentials(credentials);

			const oauth2 = google.oauth2({
				auth: this.oAuth2Client,
				version: 'v2'
			});

			oauth2.userinfo.get((err, res) => {
				if (!err) {
					const profileData: Schema$Userinfo = res.data;
					resolve(profileData);
				} else {
					reject(err);
				}
			});
		});
	}
}

export default GoogleAuthService;
