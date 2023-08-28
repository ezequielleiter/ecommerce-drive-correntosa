import { Fetch } from '../src/hooks/fetchHook';

export const getProducts = async (page = 1, category = '', search = '') => {
	return await Fetch<{ category: String; search: String; page: Number }>({
		url: `/api/products`,
		query: { category, search, page }
	});
};

export const getProductsBySale = async ({id, page = 1, category = '', search = '', isProductsIds = false}) => {
	if (isProductsIds) {
		return await Fetch<{ id: String, category: String; search: String; page: Number }>({
			url: `/api/products/product-by-sale`,
			query: { id, category, search, page, isProductsIds}
		});
	}
	return await Fetch<{ id: String, category: String; search: String; page: Number }>({
		url: `/api/products/product-by-sale`,
		query: { id, category, search, page }
	});
};


export const getuserOrderBySale = async (userId, saleId) => {
	return await Fetch<{ userId: string , saleId: string }>({
		url: `/api/cart/cart-by-sale`,
		query: {userId, saleId }
	});
};


export const getOrderBySale = async (saleId, userId) => {
	return await Fetch<{ saleId: string, userId: string }>({
		url: `/api/cart/order-by-sale`,
		query: { saleId, userId }
	});
};

export const getOrderByUser = async (userId) => {
	return await Fetch<{ userId: string }>({
		url: `/api/cart/order-by-user`,
		query: { userId }
	});
};

export const getCategories = async () => {
	return await Fetch({ url: '/api/categories' });
};

export const getCartStatus = async () => {
	return await Fetch({ url: '/api/cart/status' });
};

export const getOrdersToPost = async () => {
	return await Fetch({ url: '/api/admin/orders/to-post' });
};
