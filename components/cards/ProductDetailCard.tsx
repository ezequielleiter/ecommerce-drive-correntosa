import React, { FC, useState } from 'react';
import { Avatar, Grid, Text } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProductCart } from '../../src/global/types';
import QuantityControls from '../QuantityControls';

type ProductCartProps = {
	product: ProductCart;
	deleteProduct(product: ProductCart): void;
	updateProduct(product: ProductCart, qty: number);
};

const ProductDetailCard: FC<ProductCartProps> = ({ product, deleteProduct, updateProduct }) => {
	const [quantity, setQuantity] = useState(product.qty);

	return (
		<Grid.Container className="product-cart">
			<Grid xs={4} className="product-image-container" justify="center">
				<Avatar src={`https://drive.google.com/uc?id=${product.picture}&export=download`} css={{ size: '$20' }} />
			</Grid>
			<Grid xs={8} className="product-info">
				<div className="title-buttons">
					<div>
						<Text weight="bold">{product.name}</Text>
						<Text> c/u: ${product.finalPrice}</Text>
						<small className="product-description">{product.minimum}</small>
					</div>
					<div className="product-buttons">
						<QuantityControls
							qty={quantity}
							addProduct={() => {
								setQuantity(prev => prev + 1);
								updateProduct(product, quantity + 1);
							}}
							deleteProduct={() => {
								if (quantity > 1) {
									setQuantity(prev => prev - 1);
									updateProduct(product, quantity - 1);
								}
							}}
						/>
					</div>
				</div>
				<div className="button-price">
					<FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faTrash} onClick={() => deleteProduct(product)} />
					<Text className="product-price">${product.finalPrice * product.qty}</Text>
				</div>
			</Grid>
		</Grid.Container>
	);
};

export default ProductDetailCard;
