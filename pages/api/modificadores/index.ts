import { container } from 'tsyringe';
import AgregadoService from '../../../src/services/AgregadoService';

export default async function Productores(req, res) {
	try {
        const agregadoService = container.resolve(AgregadoService);
        const agregado = req.body ? JSON.parse(req.body) : ""
        if (req.method === 'POST') {
            await agregadoService.createAgregado(agregado)
            return res.status(200).json({ error: false, message: 'Valor agregado creado correctamente' });
        } else if (req.method === 'PUT') {
            const modificadorIdToEdit = req.query.modificadorIdToEdit
            await agregadoService.updateAgregado(modificadorIdToEdit, agregado)
            return res.status(200).json({ error: false, message: 'Valor agregado actualizado correctamente' });
        } else if (req.method === "GET") {
            const result = await agregadoService.getAllAgregado()
            return res.status(200).json(result);
        }
	} catch (error) {
		console.log(error, 'error on update order');
		res.status(500).json(error);
	}
}