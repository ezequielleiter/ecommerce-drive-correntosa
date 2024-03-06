import { container } from 'tsyringe';
import OrderService from '../../../src/services/OrderService';
import toObjet from '../../../src/helpers/toObjet';
import ProductService from '../../../src/services/ProductService';
import AgregadoService from '../../../src/services/AgregadoService';
import calculateFinalPrice from '../../../src/helpers/prices/calculateFinalPrice';
import { findModificadores } from '../../../helpers/findModificadores';
const UNDEFINED = 'undefined';
const FALSE = 'false';

export default async function getOrderBySale(req, res) {
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
		const parseAllModificadores = toObjet(allModificadores);
		const parseAllProductos = toObjet(allProductos);
		const { saleId, userId } = req.query;
		if (userId !== UNDEFINED) {
			const orderByUserStatus = await orderService.getOrderBySaleAndUser(saleId, userId);
			const parseOrderByUserStatus = toObjet(orderByUserStatus);
			const findAllProducts = [];
			parseOrderByUserStatus.products.forEach(producto => {
				const findProduct = parseAllProductos.find(p => {
					return p._id.toString() === producto.productId;
				});
				findProduct.qty = producto.qty;
				producto = findProduct;
				producto.finalPrice = calculateFinalPrice({
					price: producto.price,
					modificadoresSeleted: findModificadores(parseAllModificadores, producto.modificadoresIds)
				});
				findAllProducts.push(producto);
			});
			parseOrderByUserStatus.products = findAllProducts;
			const resultJson = JSON.stringify(parseOrderByUserStatus);
			res.status(200).json(resultJson);
			return;
		}
		const orderBySaleStatus = await orderService.getOrderBySale(saleId);
		res.status(200).json(orderBySaleStatus);
	} catch (error) {
		console.log(error, 'Getting cart status');
		res.status(500).json(error);
	}
}
