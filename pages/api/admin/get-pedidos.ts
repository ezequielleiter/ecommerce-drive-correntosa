import { getPedidos } from '../../../commands/UpdateProducts';

export default async function updateProductsOnDb(req, res) {
	try {
		const result = await getPedidos();
		res.status(200).json({ error: false, result });
	} catch (error) {
		res.status(500).json(error);
	}
}