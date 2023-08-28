import { container } from 'tsyringe';
import ProductService from '../../../src/services/ProductService';

export default async function saveProduct(req, res) {
	const productService = container.resolve(ProductService);
	try {
		const product = JSON.parse(req.body)
		if (req.method === 'POST') {
			const result = await productService.saveProduct(product);
			res.status(200).json(result);
		}
		if (req.method === 'PUT') {
			const productoId = req.query.productorIdToEdit
			const result = await productService.updateProduct(productoId, product);
			res.status(200).json(result);;
		}
		
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error });
	}
}