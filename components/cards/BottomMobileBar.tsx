import { Badge, Button, Grid, Link, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { CartIcon } from '../svg/CartIcon';
import { Cart } from '../../src/global/types';

type props = {
	cart: Cart;
};

const BottomMobileBar: FC<props> = ({ cart }) => {
	const router = useRouter();

	return (
		<Grid.Container className="container-mobile-bar visible" style={{ padding: '1em' }}>
			<Grid xs={7}>
				<div className="mobile-text-container">
					<Text className="mobile-text-bar" color="#FFFFFF">
						Total: ${cart.products?.length > 0 ? cart.total : 0}
					</Text>
				</div>
			</Grid>
			<Grid xs={4}>
				<div className="mobile-link-container">
					<Link
						style={{
							color: '#FFFFFF',
							textDecorationLine: 'underline',
							paddingLeft: '1rem',
							borderLeft: '1px solid #FFFFFF'
						}}
						className="mobile-cart-link"
						onClick={() => router.push('/cart')}
					>
						Ir al carrito
					</Link>
				</div>
			</Grid>
			<Grid xs={1}>
				<div className="mobile-link-container">
					<Badge
						color="warning"
						size={'sm'}
						content={cart.products?.length}
						shape="circle"
						onClick={() => router.push('/cart')}
					>
						<CartIcon fill="white" size={24} width={24} height={24} onClick={() => router.push('/cart')} />
					</Badge>
				</div>
			</Grid>
		</Grid.Container>
	);
};

export default BottomMobileBar;
