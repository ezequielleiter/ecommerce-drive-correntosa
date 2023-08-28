import { useState } from 'react';
import { Cart, ProductCart } from '../global/types';
import sumTotals from '../helpers/sumTotal';

export function useCart(cartSSR: Cart) {
	let originCard: any = []
	if (cartSSR?.products.length > 0) {
		originCard = cartSSR
	}	
	const [cart, setCart] = useState(cartSSR);
	const [isModified, setIsModified] = useState(false)


	const setCarBySale = (cartBysale) =>{
		cartBysale.orderId = cartBysale._id
		setCart(cartBysale)
	}
	const updateProduct = (productToUpdate: ProductCart) => {
		const products = cart.products.map(product => {
			if (product._id === productToUpdate._id) {
				return { ...productToUpdate, total: productToUpdate.finalPrice * productToUpdate.qty };
			}
			return product;
		});
		const newCart = { products, total: sumTotals(products), orderId: cart.orderId };
		JSON.stringify(originCard) === JSON.stringify(newCart) ? setIsModified(false) : setIsModified(true)
		setCart(newCart);
	};

	const addProduct = (productToAdd: ProductCart) => {
		let products = cart.products;	
		if (productExists(productToAdd._id)) {
			products = products.map(product => {
				console.log("P TO EXIST", product);
				if (product._id === productToAdd._id) {
					productToAdd.qty = product.qty + productToAdd.qty;
					console.log("P TO ADD AND EXIST", productToAdd);
					return productToAdd;
				}				
				return product;
			});
		} else {
			products.push({ ...productToAdd, total: productToAdd.finalPrice	* productToAdd.qty });
		}
		const newCart = { products, total: sumTotals(products), orderId: cart.orderId };
		JSON.stringify(originCard) === JSON.stringify(newCart) ? setIsModified(false) : setIsModified(true)
		setCart(newCart);
	};

	const deleteProduct = (productToDelete: ProductCart) => {
		const products = cart.products.filter(product => product._id !== productToDelete._id);
		const newCart = { products, total: sumTotals(products), orderId: cart.orderId };

		JSON.stringify(originCard) === JSON.stringify(newCart) ? setIsModified(false) : setIsModified(true)

		setCart(newCart);
	};

	const productExists = _id => cart.products.find(product => product._id === _id);

	return { ...cart, updateProduct, addProduct, deleteProduct, isModified, setCarBySale};
}
