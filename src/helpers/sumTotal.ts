const sumTotals = (products) => {
    let total = 0;
    products.forEach((product) => {
        const productTotal = product.finalPrice * product.qty
        total += productTotal
    })
    return total
} 

export default sumTotals