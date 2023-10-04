const calculateFinalPrice = ({ price, modificadoresSeleted }) => {
	let finalPrice = Number(price);
	modificadoresSeleted.forEach(({ value, type, margen }) => {
		if (!margen && type === '+') {
			const resultado = finalPrice + Number(value);
			finalPrice = resultado;
			return;
		}
		if (!margen && type === '%') {
			const tresSimple = (price * Number(value)) / 100;
			const resultadoPorcentual = finalPrice + tresSimple;
			finalPrice = resultadoPorcentual;
		}
		if (margen && type === '%') {
			const tresSimple = (finalPrice * Number(value)) / 100;
			const resultadoPorcentual = finalPrice + tresSimple;
			finalPrice = resultadoPorcentual;
		}
	});

	return finalPrice.toFixed(2);
};

export default calculateFinalPrice;
