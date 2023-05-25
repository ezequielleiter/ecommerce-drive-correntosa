import { singleton } from 'tsyringe';
import ApiException from '../exceptions/ApiExeption';
import { ProductModel } from '../global/types';
import Config from '../models/Config';
import Product from '../models/Product';
import BaseService from './BaseService';

@singleton()
class ProductService extends BaseService {
	constructor() {
		super();
	}


	async createProduct(product: ProductModel) {
		try {
			await Product.createProduct(product);
			return { error: false };
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async saveProduct(product) {
		try {
			await Product.createProduct(product);
			return { error: false };
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async updateProduct(productoId, product) {
		try {
			await Product.updateProduct(productoId, product);
			return { error: false };
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async bulkUpdateProduct(products) {
		try {
			const result = await Product.bulkUpdateProduct(products);
			return result;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async saveProductForSale(products, salesId) {
		try {
			//hay que handlear el erro
			const saleToUpdate = await Config.getSale(salesId);
			await Config.updateProducts(products, saleToUpdate);
			return { error: false };
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getProducts(category, page: number = 1) {
		try {
			const products = await Product.getProducts(category, page);
			return products;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getAllProducts() {
		try {
			const products = await Product.getAllProducts();
			return products;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async getProductsBySale(id, query) {
		try {
			const products = await Config.getProductsBySale(id, query);
			return products;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	// async getByCategory(category: string, page: number = 1) {
	// 	try {
	// 		const products = await Product.getByCategory(category, page);
	// 		return products;
	// 	} catch (e) {
	// 		throw new ApiException(e);
	// 	}
	// }

	async searchProduct(query, category) {
		try {
			const products = await Product.search(query, category);
			return products;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async searchProductBySale(query, category) {
		try {
			const products = await Product.search(query, category);
			return products;
		} catch (e) {
			throw new ApiException(e);
		}
	}

	async clearAll() {
		try {
			return Product.deleteAll();
		} catch (e) {
			throw new ApiException(e);
		}
	}
}

export default ProductService;
