const calculateFinalPrice = producto => {
	let finalPrice = 0;
	if (producto.addedRecharge.length !== 0) {
		producto.addedRecharge.forEach(recharge => {
			if (recharge.type === '%') {
				if (finalPrice !== 0) {
					finalPrice = finalPrice + producto.price * (recharge.recharge / 100);
					return;
				}
				finalPrice = producto.price + producto.price * (recharge.recharge / 100);
				return;
			} else if (recharge.type === '+') {
				if (finalPrice !== 0) {
					finalPrice = finalPrice + recharge.recharge;
					return;
				}
				finalPrice = producto.price + recharge.recharge;
				return;
			}
		});
		producto.finalPrice = finalPrice;
		return producto;
	}
	producto.finalPrice = producto.price;
	return producto;
};

export default calculateFinalPrice