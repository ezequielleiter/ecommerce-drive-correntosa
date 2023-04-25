import { container } from 'tsyringe';
import ProductService from '../../../src/services/ProductService';

export default async function saveProduct(req, res) {
	const productService = container.resolve(ProductService);
	try {
		console.log(req.query);
        
		// const result = await productService.getProductsBySale(id, req.query);
		// res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.jsonOutPut() });
	}
}