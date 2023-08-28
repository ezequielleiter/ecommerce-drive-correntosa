import { container } from 'tsyringe';
import ProductService from '../../../src/services/ProductService';
import ConfigService from '../../../src/services/ConfigService';
import ProductorService from '../../../src/services/ProductorService';
import AgregadoService from '../../../src/services/AgregadoService';
import TagService from '../../../src/services/TagService';
import calculateFinalPrice from '../../../src/helpers/prices/calculateFinalPrice';

export default async function getProductsBySale(req, res) {
	try {
		const [productService, configService, productorService, modificadoresService, tagService] = await Promise.all([
			container.resolve(ProductService),
			container.resolve(ConfigService),
			container.resolve(ProductorService),
			container.resolve(AgregadoService),
			container.resolve(TagService)
		]);
		const { id, isProductsIds } = req.query;
		//Al momento de mostrar los productos en la compra
		if (isProductsIds === 'true') {
			const [allProductor, allModificadores, compra, allTags] = await Promise.all([
				productorService.getAllProductor(),
				modificadoresService.getAllAgregado(),
				configService.getSaleById(id),
				tagService.getAllTag()
			]);

			const findModificadores = (allModificadores, modificadoresIds) => {
				const completeModificadores = [];
				modificadoresIds.forEach(modificadorId => {
					const findCompleteModificador = allModificadores.find(m => m._id.toString() === modificadorId);
					if (findCompleteModificador) {
						completeModificadores.push(findCompleteModificador);
					}
				});
				return completeModificadores;
			};
			if (compra) {
				const productsIds = compra.productsIds;
				const result = await productService.getProductsByIds(productsIds);
				const stringifyResult = JSON.stringify(result)
				const parseResult = JSON.parse(stringifyResult)

				parseResult.forEach(producto => {
					producto.seller = allProductor.find((p) => p._id.toString() === producto.seller)
					producto.finalPrice = calculateFinalPrice({
						price: producto.price,
						modificadoresSeleted: findModificadores(allModificadores, producto.modificadoresIds)
					})
				});
				const resultJson = JSON.stringify(parseResult)

				res.status(200).json(resultJson);
				return;
			}
		}
		const result = await productService.getProductsBySale(id, req.query);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.jsonOutPut() });
	}
}
