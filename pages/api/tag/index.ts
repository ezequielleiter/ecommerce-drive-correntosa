import { container } from 'tsyringe';
import TagService from '../../../src/services/TagService';

export default async function Productores(req, res) {
	try {
        const tagService = container.resolve(TagService);
        const tag = req.body ? JSON.parse(req.body) : ""
        if (req.method === 'POST') {
            await tagService.createTag(tag)
            return res.status(200).json({ error: false, message: 'Tag creado correctamente' });
        } else if (req.method === 'PUT') {
            const tagIdToEdit = req.query.tagIdToEdit
            await tagService.updateTag(tagIdToEdit, tag)
            return res.status(200).json({ error: false, message: 'Tag actualizado correctamente' });
        } else if (req.method === "GET") {
            const result = await tagService.getAllTag()
            return res.status(200).json(result);
        }
	} catch (error) {
		console.log(error, 'error on update order');
		res.status(500).json(error);
	}
}