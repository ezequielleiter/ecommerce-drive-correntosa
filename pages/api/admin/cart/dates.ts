import { container } from 'tsyringe';
import ConfigService from '../../../../src/services/ConfigService';

export default async function updateCartDates(req, res) {
	try {
		if (req.method === 'PUT') {
			const configService = container.resolve(ConfigService);
			const body = JSON.parse(req.body);

			let {
				openDate,
				closeDate,
				name,
				id,
				deliveryDate,
				openDeliveryHour,
				closeDeliveryHour,
				locationName,
				locationUrl,
				productsIds
			} = body;
			if (!openDate || !closeDate) {
				return res.status(400).json({ error: true, message: 'Missing dates' });
			}
			//const datesToSend = {openDate, closeDate}
			await configService.setDates(
				openDate,
				closeDate,
				name,
				id,
				deliveryDate,
				openDeliveryHour,
				closeDeliveryHour,
				locationName,
				locationUrl,
				productsIds
			);
			const newStatus = await configService.getCartStatus();
			res.status(200).json({ ...newStatus });
		} else {
			const configService = container.resolve(ConfigService);
			const body = JSON.parse(req.body);

			let { openDate, closeDate, name, deliveryDate, openDeliveryHour, closeDeliveryHour, locationName, locationUrl, productsIds } =
				body;
			if (!openDate || !closeDate) {
				return res.status(400).json({ error: true, message: 'Missing dates' });
			}

			await configService.createSale(
				openDate,
				closeDate,
				name,
				deliveryDate,
				openDeliveryHour,
				closeDeliveryHour,
				locationName,
				locationUrl,
				productsIds
			);
		}
	} catch (error) {
		console.log(error, 'Error updating cart dates');
		res.status(500).json({ error: error.jsonOutPut() });
	}
}
