const calculateFinalPrice = ({ price, modificadoresSeleted }) => {
    let finalPrice = Number(price);
     modificadoresSeleted.forEach(({value, type}) => {
        if (type === "+") {
            const resultado = finalPrice + Number(value)
            finalPrice = resultado
            return
        }
        if(type === "%"){
            const tresSimple = (price * Number(value))/100
            const resultadoPorcentual = finalPrice + tresSimple
            finalPrice = resultadoPorcentual
        }
     });

    return finalPrice;	
};

export default calculateFinalPrice;