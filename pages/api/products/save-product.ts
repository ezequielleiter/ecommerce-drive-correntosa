import { container } from 'tsyringe';
import ProductService from '../../../src/services/ProductService';
import calculateFinalPrice from '../../../helpers/calculateFinalPrice';


export default async function saveProduct(req, res) {
	const productService = container.resolve(ProductService);
	try {
		const product = JSON.parse(req.body)
        const productWhithFinalPrice = calculateFinalPrice(product)
		const result = await productService.saveProduct(productWhithFinalPrice);
		res.status(200).json(result);;
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error });
	}
}