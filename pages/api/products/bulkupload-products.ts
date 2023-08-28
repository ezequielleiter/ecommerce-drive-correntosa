import { container } from 'tsyringe';
import { Response } from 'express';
import ProductService from '../../../src/services/ProductService';
import { parseCSV } from '../../../helpers/parseCSV';

export default async function bulkUploadProducts(file, res: Response) {
	const productService = container.resolve(ProductService);
	try {
		const csvData = parseCSV(file.body);
		const result = await productService.bulkUpdateProduct(csvData);
		res.status(200).json(result);;
	} catch (error) {
		console.log(error, 'Error al actualizar los productos');
		res.status(500).json(error);
	}
}
