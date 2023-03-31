import mongoose, { Schema, model, Document } from 'mongoose';

export interface ConfigI {
	openDate: String | null;
	closeDate: String | null;
	name: String | null;
	products: any | null;
	deliveryDate: String | null;
	openDeliveryHour: String | null;
	closeDeliveryHour: String | null;
	locationName: String | null;
	locationUrl: String | null;
}

interface Product {
	totalProductos: String | null;
	totalPaginas: Number | null;
	paginaActual: String | null;
	productos: String | null;
}

interface BaseConfigDocument extends ConfigI, Document {}

const Config = new Schema<BaseConfigDocument>({
	openDate: { type: 'string' || null },
	closeDate: { type: 'string' || null },
	name: { type: 'string' || null },
	products: { type: 'array' || null },
	deliveryDate: { type: 'string' || null },
	openDeliveryHour: { type: 'string' || null },
	closeDeliveryHour: { type: 'string' || null },
	locationName: { type: 'string' || null },
	locationUrl: { type: 'string' || null }
});

Config.statics.getCartStatus = async function () {
	const currentConfig = await this.findOne({});
	const { openDate, closeDate, name } = currentConfig;

	if (!openDate || !closeDate) {
		return { openDate: null, closeDate: null, status: 'closed' };
	}

	let formattedOpenDate = new Date(currentConfig.openDate);
	let formattedClosedDate = new Date(currentConfig.closeDate);

	formattedOpenDate.setHours(formattedOpenDate.getHours() + 3);
	formattedClosedDate.setHours(formattedClosedDate.getHours() + 3);

	const openTime = formattedOpenDate.getTime();
	const closeTime = formattedClosedDate.getTime();

	const today = new Date();
	const isOpen = today.getTime() >= openTime && today.getTime() <= closeTime;
	let status = '';

	if (isOpen) {
		status = 'open';
	} else if (today.getTime() < openTime) {
		status = 'toOpen';
	} else {
		status = 'closed';
	}
	return { openDate, closeDate, status, name };
};

Config.statics.getAllSales = async function () {
	const allSales = await this.find({});
	return allSales;
};

Config.statics.getSale = async function (salesId) {
	const sale = await this.find({ _id: salesId });
	return sale[0];
};

Config.statics.createSale = async function (
	openDate,
	closeDate,
	name,
	deliveryDate,
	openDeliveryHour,
	closeDeliveryHour,
	locationName,
	locationUrl
) {
	const sale = await this.insertMany({
		openDate: openDate.toString(),
		closeDate: closeDate.toString(),
		name: name,
		deliveryDate,
		openDeliveryHour,
		closeDeliveryHour,
		locationName,
		locationUrl
	});
	return sale[0];
};

Config.statics.updateDates = async function (
	openDate,
	closeDate,
	name,
	id,
	deliveryDate,
	openDeliveryHour,
	closeDeliveryHour,
	locationName,
	locationUrl
) {
	await this.findOneAndUpdate(
		{ _id: id },
		{
			openDate: openDate.toString(),
			closeDate: closeDate.toString(),
			name: name,
			deliveryDate,
			openDeliveryHour,
			closeDeliveryHour,
			locationName,
			locationUrl
		}
	);
};

Config.statics.updateProducts = async function (products, saleToUpdate) {
	const saleJSON = JSON.stringify(saleToUpdate);
	const saleObj = JSON.parse(saleJSON);
  
	products.forEach(product => {
	  const existingProductIndex = saleObj.products.findIndex(p => p._id.toString() === product._id.toString());	  
	  if (existingProductIndex !== -1) {
		saleObj.products[existingProductIndex].name = product.name;
		saleObj.products[existingProductIndex].price = product.price;
		saleObj.products[existingProductIndex].stock = product.stock;
	  } else {
		saleObj.products.push(product);
	  }
	});
	await this.updateOne({ _id: saleObj._id.toString() }, { $set: { products: saleObj.products } }, {});
  };

Config.statics.getProductsBySale = async function (id: string, query) {
	const limit = 60;
	const { category, search, page } = query;
	let products: Product = {
		totalProductos: '',
		totalPaginas: 0,
		paginaActual: '',
		productos: ''
	};
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const productList = await this.find({ _id: id });

	if (productList.length === 0) {
		throw new Error('No se encontro una compra para este id');
	}

	const filteredProductos = productList[0].products.filter(producto => {
		if (category.length > 1) {
			return producto.category === category && producto.name.includes(search && search.length > 1 ? search : '');
		}
		return producto.name.includes(search && search.length > 1 ? search : '');
	});

	const paginatedProductos = filteredProductos.slice(startIndex, endIndex);

	products.totalProductos = filteredProductos.length;
	products.totalPaginas = Math.ceil(filteredProductos.length / limit);
	products.paginaActual = page;
	products.productos = paginatedProductos;

	return products;
};

if (!mongoose.models.Config) {
	model<BaseConfigDocument>('Config', Config);
}

export default mongoose.models.Config;
