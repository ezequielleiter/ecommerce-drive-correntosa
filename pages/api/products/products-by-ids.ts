import { container } from 'tsyringe';
import ProductService from '../../../src/services/ProductService';

export default async function getProducts(req, res) {
	const productService = container.resolve(ProductService);
	try {
		const { productsIds } = req.query;
		const result = await productService.getProductsByIds(productsIds.split(','));
		const resultJson = JSON.stringify(result)
		return res.status(200).json(resultJson);
	} catch (error) {
		res.status(500).json({ error: error.jsonOutPut() });
	}
}
