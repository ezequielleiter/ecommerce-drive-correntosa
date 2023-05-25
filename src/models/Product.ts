import { truncate } from 'fs/promises';
import mongoose, { Schema, model, Document } from 'mongoose';
import { ProductModel } from '../global/types';

interface BaseProductDocument extends ProductModel, Document {}

const Product = new Schema<BaseProductDocument>({
	stock: { type: 'boolean' },
	code: { type: 'string' },
	name: { type: 'string' },
	minimum: { type: 'string' },
	price: { type: 'number' },
	category: { type: 'string' },
	seller: { type: 'string' },
	picture: { type: 'string' },
	tags: { type: [] },
	sizes: { type: [] },
	color: { type: [] },
	description: { type: 'string' },
	weight: { type: 'string' },
	measurement: { type: 'string' },
	modificadoresIds: { type: [] }
});

Product.index({ name: 'text' });

Product.statics.getProducts = async function (category: string, page: number) {
	const limit = 60;

	const productsCount = category ? await this.countDocuments({ category }) : await this.countDocuments();

	const query = category ? { category } : {};
	const products = await this.find(query)
		.select({ __v: 0 })
		.limit(limit)
		.skip(limit * (page - 1))
		.sort({ code: 1 });

	const totalPages = Math.ceil(productsCount / limit);
	return { products, totalPages };
};

Product.statics.createProduct = async function (product: ProductModel) {
	await this.create(product);
};

Product.statics.getAllProducts = async function () {
	const allProducts = await this.find({}).select({ __v: 0 });
	return allProducts;
};

Product.statics.updateProduct = async function (productoId, product: { productoId: {}; product: ProductModel }) {
	const updateProduct = await this.findByIdAndUpdate(productoId, product, { new: true });
	return updateProduct;
};

Product.statics.bulkUpdateProduct = async function (products) {
	const errors = [];
	let productUpdate = 0;

	for (let i = 0; i < products.length; i++) {
		const product = products[i];
		console.log("EN BULK", product);
		
		try {
			if (product.code) {
				await this.findByIdAndUpdate(product.code, product, { new: true });
			} else {
				await this.findByIdAndUpdate(product._id, product, { new: true });
			}
			productUpdate++;
		} catch (error) {
			if (error.path === '_id') {
				error.message = `El id del producto es incorrecto, revise el id: ${error.value}`;
			}
			errors.push({ _id: product._id, error: error.message });
		}
	}

	return {
		productUpdate,
		errors
	};
};

// Product.statics.getByCategory = async function (category: string, page: number) {
// 	const limit = 60;

// 	const productsCount = await this.countDocuments({ category });

// 	const products = await this.find({ category })
// 		.select({ _id: 0, __v: 0 })
// 		.limit(limit)
// 		.skip(limit * (page - 1));

// 	if (!products.length) {
// 		throw new Error(`No products found on category ${category}`);
// 	}

// 	const totalPages = Math.ceil(productsCount / limit);
// 	return { products, totalPages };
// };

Product.statics.deleteAll = async function () {
	await this.deleteMany({});
};

Product.statics.search = async function (category, search) {
	const query = category ? { category, $text: { $search: search } } : { $text: { $search: search } };
	const products = await this.find(query, { score: { $meta: 'textScore' } }).sort({
		score: { $meta: 'textScore' }
	});
	return { products };
};

if (!mongoose.models.Product) {
	const productModel = model<BaseProductDocument>('Product', Product);
	productModel.createIndexes();
}

export default mongoose.models.Product;
