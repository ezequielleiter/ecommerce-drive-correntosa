import { singleton } from 'tsyringe';
import config from '../../constants/config';
import { connection, connect, ConnectionStates, ConnectOptions } from 'mongoose';

@singleton()
class BaseService {
	public isDbConnected: ConnectionStates;

	constructor() {
		this.mongoInit().catch(e => console.log(e, 'error on mongo connection'));
	}

	async mongoInit(): Promise<ConnectionStates> {
		return new Promise(async (resolve, reject) => {
			try {
				if (this.isDbConnected) return;
				let db = null;
				if (process.env.DATABASE_ENV === "true") {
					db = await connect('mongodb://localhost:27017/test');
				} else {
					db = await connect(
						`mongodb+srv://${config.mongo.MONGO_USERNAME}:${config.mongo.MONGO_PASSWORD}@${config.mongo.MONGO_HOST}/?retryWrites=true&w=majority`,
						{
							useNewUrlParser: true,
							useUnifiedTopology: true,
							authSource: 'admin'
						} as ConnectOptions
					); 
				}
				this.isDbConnected = db.connections[0].readyState;
				resolve(db.connections[0].readyState);
			} catch (e) {
				reject(e);
			}
		});
	}
}

export default BaseService;
