import { Card, Grid, Text, Row, Button, Image } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceLaughBeam } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { CartIcon } from '../svg/CartIcon';
import { FC, useState } from 'react';
import { productType } from '../../src/global/types';
import QuantityControls from '../QuantityControls';

type props = {
	item: productType;
	addProduct(product: productType, qty: number): void;
};

const ProductCard: FC<props> = ({ item, addProduct }) => {
	const [quantity, setQuantity] = useState(1);	
	return (
		<Grid xs={12} sm={12} md={12} lg={12} xl={12}>
			<Card css={{ margin: 0, letterSpacing: 0 }}>
				<Card.Body className="product-container">
					<Grid.Container gap={1} justify="space-around">
						<Grid xs={4}>
							<Image objectFit="contain" src={`https://drive.google.com/uc?id=${item.picture}&export=download`} />
						</Grid>
						<Grid xs={8} className="details-container" lg={6} md={6} xl={6}>
							<Text className="product-name">{item.name}</Text>
							<Text className="product-reference">{item.minimum}</Text>
							<Text className="product-supplier">
								<FontAwesomeIcon icon={faFaceLaughBeam} />
								{item.seller.name}
							</Text>
							<Text className="product-price">${item.finalPrice}</Text>
						</Grid>
					</Grid.Container>
					<Row>
						<Grid sm={7} xs={7} lg={6} md={6} xl={6} className="product-quantity" justify="center">
							<QuantityControls
								qty={quantity}
								addProduct={() => {
									setQuantity(prev => prev + 1);
								}}
								deleteProduct={() => {
									if (quantity > 1) setQuantity(prev => prev - 1);
								}}
							/>
						</Grid>
						<Grid sm={3} xs={3} lg={6} md={6} xl={6}>
							<Button
								onClick={() => {
									addProduct(item, quantity);
									toast.warn('Agregado exitosamente', {
										autoClose: 1500,
										icon: <CartIcon fill="#EA903C" size={24} width={16} height={16} />
									});
								}}
								className="button-text"
								css={{ backgroundColor: '#F29400', color: 'black', fontWeight: 400 }}
								auto
								flat
							>
								Agregar
							</Button>
						</Grid>
					</Row>
				</Card.Body>
			</Card>
		</Grid>
	);
};

export default ProductCard;
