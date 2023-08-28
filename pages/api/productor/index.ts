import { container } from 'tsyringe';
import ProductorService from '../../../src/services/ProductorService';

export default async function Productores(req, res) {
	try {
        const productorService = container.resolve(ProductorService);
        const productor = req.body ? JSON.parse(req.body) : ""
        if (req.method === 'POST') {
            await productorService.createProductor(productor)
            return res.status(200).json({ error: false, message: 'Productor creado correctamente' });
        } else if (req.method === 'PUT') {
            const productorId = req.query.productorId
            await productorService.updateProductor(productorId, productor)
            return res.status(200).json({ error: false, message: 'Productor actualizado correctamente' });
        } else if (req.method === "GET") {
            const result = await productorService.getAllProductor()
            return res.status(200).json(result);
        }
	} catch (error) {
		console.log(error, 'error on update order');
		res.status(500).json(error);
	}
}
