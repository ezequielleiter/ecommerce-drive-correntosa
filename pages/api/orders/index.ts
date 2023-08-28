import { getIronSession, IronSessionData } from 'iron-session';
import { container } from 'tsyringe';
import OrderService from '../../../src/services/OrderService';
import { sessionOptions } from '../../../src/utils/withIronSession';
import sendEmail from '../../../helpers/sendEmail';
import RenderMail from '../../../src/utils/Mail';

export default async function postOrder(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).send({ message: 'Invalid method. Only POST requests allowed' });
	}
	try {
		const orderService = container.resolve(OrderService);
		const body = JSON.parse(req.body);
		const { products, total, saleId } = body;

		if (!products) {
			return res.status(400).json({ error: true, message: 'Missing products' });
		}

		const currentSession: IronSessionData = await getIronSession(req, res, sessionOptions);
		
		const { email, name, id } = currentSession.user;
		
		const productToSave = products.map((product) => {
			return {
				productId: product._id,
				qty: product.qty
			}
		})
		await orderService.saveOrder({ userId: id, products: productToSave, email, total, saleId, paymentType: null, checked: null, controller: null });
	
		// Enviar mail

		// const mailData = {
		// 	from: 'Compras Almargen',
		// 	to: email,
		// 	subject: `Tu pedido fue guardado`,
		// 	html: RenderMail({ products, total, name }),
		// 	text: ''
		// };

		// sendEmail(mailData);

		console.log("Nuevo pedido", {email, id, products})

		res.status(200).json({ success: true, error: false });
	} catch (error) {
		console.log(error, "Error saving order");
		res.status(500).json(error);
	}
}
