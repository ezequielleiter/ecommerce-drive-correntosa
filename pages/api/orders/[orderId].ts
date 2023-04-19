import { getIronSession, IronSessionData } from 'iron-session';
import { container } from 'tsyringe';
import sendEmail from '../../../helpers/sendEmail';
import OrderService from '../../../src/services/OrderService';
import RenderMail from '../../../src/utils/Mail';
import { sessionOptions } from '../../../src/utils/withIronSession';

export default async function updateOrder(req, res) {
	if (req.method !== 'PUT') {
		return res.status(405).send({ message: 'Invalid method. Only PUT requests allowed' });
	}
	try {
		const orderService = container.resolve(OrderService);
		const { orderId } = req.query;
		const body = JSON.parse(req.body);
		const { products, total, checked, controller, paymentType, isController } = body;
	
		if (isController) {
			await orderService.closeOrder(orderId, {products, total, checked, controller, paymentType});
			res.status(200).json({ error: false, message: 'Pedido controlado correctamente' });
			return
		}
		await orderService.updateOrder(orderId, {products, total});
		const currentSession: IronSessionData = await getIronSession(req, res, sessionOptions);
		const { email, name } = currentSession.user;

		// const mailData = {
		// 	from: 'Compras Almargen',
		// 	to: email,
		// 	subject: `Tu pedido fue guardado`,
		// 	html: RenderMail({ products, total, name }),
		// 	text: ''
		// };

		// sendEmail(mailData);

		console.log("Pedido actualizado", {email, products})

		res.status(200).json({ error: false, message: 'Order updated successfully' });
	} catch (error) {
		console.log(error, 'error on update order');
		res.status(500).json(error);
	}
}
