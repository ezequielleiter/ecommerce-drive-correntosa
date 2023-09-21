export type ProductCart = {
	productId: any;
	_id: string;
	qty: number;
	name: string;
	total: number;
	price?: number;
	minimum: string;
	picture?: string;
	seller?: string;
	finalPrice: number;
};

export type Contacto = {
	email: string;
	telefono: string;
	direccion: string;
};

export type UserLogged = {
	id_google_sheet?: string;
	id?: string;
	name?: string;
	email?: string;
	profile_picture?: string;
	logged?: boolean;
	isAdmin?: boolean;
	isSuperAdmin?: boolean;
};

export type Cart = {
	products: Array<ProductCart>;
	total: number;
	orderId: string;
	saleId?: string;
};

export type Sales = {
	_id?: string;
	openDate?: string;
	closeDate?: string;
	name?: string;
	status?: string;
};

export type GoogleSheetDataType = Array<Array<string>>;

export type OrderType = Array<{ userId: string; email: string; product: string; cantidad: string; code: number }>;

export type FileInfoType = Array<{ webViewLink: string; code: number }>;

export type ProductModel = {
	stock: boolean;
	code?: number | string;
	name: string;
	minimum?: string;
	price: number; // este es el valor final del producto
	category?: string;
	seller: string;
	google_sheet_id?: string;
	picture?: string;
	tags: [];
	sizes: []; // si es un producto que tiene talles, va a decir los talles que tiene
	color: []; // si tiene un color, va a decir el color
	description: string;
	modificadoresIds: []; // esto son los valores agregados al producto
	measurement: string; //va a tener la unidad de medida del producto (unidad, kg, gr, cl)
	weight: string | null; // si tiene un peso o volumen, va a decir la cantidad
};

export type ProductorModel = {
	name: string;
	picture?: string;
	tags: string[];
	description: string;
	contact: Contacto;
};

export type TagModel = {
	name: string;
	description: string;
	color: string;
};

export type AgregadoModel = {
	name: string;
	type: string;
	value: string;
	discount: boolean;
	margen: boolean
};

export type statusCart = {
	status: string;
	openDate: string;
	closeDate: string;
	name: string;
};

export type datesFormType = {
	openDate: string;
	closeDate: string;
	name: string;
	id?: string;
	deliveryDate: string;
	openDeliveryHour: string;
	closeDeliveryHour: string;
	locationName: string;
	locationUrl: string;
	productsIds: string | any[];
};

export type createSaleType = {
	openDate: string;
	closeDate: string;
	name: string;
	deliveryDate: string;
	openDeliveryHour: string;
	closeDeliveryHour: string;
	locationName: string;
	locationUrl: string;
	productsIds: string | any[];
};

export type createProductorType = {
	name?: string;
	picture?: string;
	tags?: string[];
	description?: string;
	contact?: Contacto;
};

export type createProductoType = {
	name?: string; //nombre,
	description?: string; //descripcion del producto
	measurement?: string; //va a tener la unidad de medida del producto (unidad, kg, gr, cl)
	picture?: string;
	weight?: string; //aca va el peso, gramo o cantidad de unidades del producto,
	sizes?: []; // si tiene talles, los talles en un string por ahora
	color?: []; // si tiene colores, los colores en un string por ahora
	seller?: string; //aca va el Id del productor,
	tags?: [];
	stock?: boolean;
	price?: number; // precio neto del producto sin agregados
	modificadoresIds?: [];
	code?: string;
};

export type createErrorProductoType = {
	name?: string; //nombre,
	description?: string; //descripcion del producto
	measurement?: string; //va a tener la unidad de medida del producto (unidad, kg, gr, cl)
	picture?: string;
	weight?: string; //aca va el peso, gramo o cantidad de unidades del producto,
	sizes?: string; // si tiene talles, los talles en un string por ahora
	color?: string; // si tiene colores, los colores en un string por ahora
	seller?: string; //aca va el Id del productor,
	tags?: string;
	stock?: string;
	price?: string; // precio neto del producto sin agregados
	modificadoresIds?: string;
};

export type errorProductorType = {
	name?: string;
	description?: string;
};

export type createTagType = {
	name?: string;
	description?: string;
	color?: string;
};

export type errorTagType = {
	name?: string;
	description?: string;
	color?: string;
};

export type createAgregadoType = {
	name?: string;
	value?: string;
	type?: string;
	discount?: boolean;
	margen?: boolean
};

export type errorAgregadoType = {
	name?: string;
	value?: string;
	type?: string;
	discount?: boolean;
	margen?: boolean
};

export type errorsFormType = {
	openDate?: string;
	closeDate?: string;
	name?: string;
	deliveryDate?: string;
	openDeliveryHour?: string;
	closeDeliveryHour?: string;
	locationName?: string;
	locationUrl?: string;
};

export type fetchData<T> = {
	url: string;
	method?: string;
	data?: T;
	query?: T | any;
	onSuccess?(response: any): void;
	onError?(error: any): void;
};

export type sheetOrder = Array<{
	email: string;
	product: string;
	code: number;
	cantidad: number;
}>;

export type productType = {
	finalPrice: string;
	stock: boolean;
	code: number;
	name: string;
	minimum: string;
	price: number;
	category: string;
	categoryName: string;
	seller: {
		name: string;
	};
	picture: string;
};

export type orderData = {
	products: productType[];
	total: number;
	checked?: boolean;
	controller?: string;
	paymentType?: string;
};
