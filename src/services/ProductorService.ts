import { singleton } from 'tsyringe';
import ApiException from '../exceptions/ApiExeption';
import { ProductorModel } from '../global/types';
import BaseService from './BaseService';
import Productor from '../models/Productor';


@singleton()
class ProductorService extends BaseService {
	constructor() {
		super();
	}

	async createProductor(productor: ProductorModel) {
		try {
            await Productor.createProductor(productor)
			return { error: false };
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

	async updateProductor(productorId, productor: ProductorModel) {
		try {
            await Productor.updateProductor({productorId, productor})
			return { error: false };
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

	async getAllProductor() {
		try {	
            const productores = await Productor.getAllProductor()
			return productores;
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

}

export default ProductorService;
