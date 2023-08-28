import { container } from 'tsyringe';
import OrderService from '../../../src/services/OrderService';
import ProductService from '../../../src/services/ProductService';
import AgregadoService from '../../../src/services/AgregadoService';
import calculateFinalPrice from '../../../src/helpers/prices/calculateFinalPrice';
import { findModificadores } from '../../../helpers/findModificadores';
import toObjet from '../../../src/helpers/toObjet';

export default async function getCartStatus(req, res) {
	try {
		const [orderService, productService, modificadoresService] = await Promise.all([
			container.resolve(OrderService),
			container.resolve(ProductService),
			container.resolve(AgregadoService)
		]);

		const [allModificadores, allProductos] = await Promise.all([
			modificadoresService.getAllAgregado(),
			productService.getAllProducts()
		]);
		const parseAllModificadores = toObjet(allModificadores)
		const parseAllProductos = toObjet(allProductos)
		const { userId, saleId } = req.query;
		const cartStatus = await orderService.getUserOrderBySale(userId, saleId);
		const parseCartStatus = toObjet(cartStatus)
		const findAllProducts = []
		parseCartStatus.products.forEach(producto => {	
			const findProduct = parseAllProductos.find((p) => {
				return p._id.toString() === producto.productId
			})
			findProduct.qty = producto.qty
			producto = findProduct;	
			producto.finalPrice = calculateFinalPrice({
				price: producto.price,
				modificadoresSeleted: findModificadores(parseAllModificadores, producto.modificadoresIds)
			})
			findAllProducts.push(producto)
		});
		parseCartStatus.products = findAllProducts;
		const resultJson = JSON.stringify(parseCartStatus)
		res.status(200).json(resultJson);
	} catch (error) {
		console.log(error, 'Getting cart status');
		res.status(500).json(error);
	}
}
