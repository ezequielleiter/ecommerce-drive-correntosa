export type ProductCart = {
	code: number;
	name: string;
	qty: number;
	total: number;
	price?: number;
	minimum: string;
	picture?: string;
	seller?: string;
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
	status?: string
};

export type GoogleSheetDataType = Array<Array<string>>;

export type OrderType = Array<{ userId: string; email: string; product: string; cantidad: string; code: number }>;

export type FileInfoType = Array<{ webViewLink: string; code: number }>;

export type ProductModel = {
	stock: boolean;
	code: number;
	name: string;
	minimum: string;
	price: number;
	category: string;
	seller: string;
	google_sheet_id?: string;
	picture?: string;
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
	query?: T;
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
	stock: boolean;
	code: number;
	name: string;
	minimum: string;
	price: number;
	category: string;
	categoryName: string;
	seller: string;
	picture: string;
};

export type orderData = {
	products: productType[];
	total: number;
};
