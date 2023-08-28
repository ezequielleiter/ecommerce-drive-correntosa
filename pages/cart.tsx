import Layout from './layout';
import Header from '../components/navigation/Header';
import { Button, Container, Grid } from '@nextui-org/react';
import ProductDetailCard from '../components/cards/ProductDetailCard';
import TotalCard from '../components/cards/TotalCard';
import { ProductCart as productType } from '../src/global/types';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { infoMessages } from '../helpers/notify';
import { Fetch } from '../src/hooks/fetchHook';
import { useAppCtx } from '../src/context';
import { SalesCtx } from '../src/salescontext';
export { getServerSideProps } from '../src/ssp/cart';

export default function Cart(props) {
	const cart = useAppCtx();
	const { saleSelected } = useContext(SalesCtx);
	const router = useRouter();
	const [loadign, setLoadign] = useState(true)

	const [productos, setProductos] = useState([])

	useEffect(() => {
		const products = cart.products.map((p) => p.productId)

		Fetch<{ id: String, category: String; search: String; page: Number }>({
			url: `/api/products/products-by-ids`,
			query: { productsIds: products },
			onError: e => {
				console.warn(`error al buscar productos`, e);
			},
			onSuccess: res => {
			 const productDef = JSON.parse(res)
				setProductos(productDef);
				setLoadign(false)
			}
		});
		infoMessages();
	}, []);

	const sendOrder = async () => {
		if (!cart.products.length) {
			console.warn(`No puedes actualizar tu orden sin productos`);
			return;
		}
		Fetch<{ products: Array<productType>; total: number; saleId: string }>({
			url: `/api/orders${cart.orderId ? `/${cart.orderId}` : '/'}`,
			method: `${cart.orderId ? 'PUT' : 'POST'}`, 
			data: { products: cart.products, total: cart.total, saleId: saleSelected._id },
			onSuccess: () => {
				router.push('/success');
			},
			onError: e => {
				console.warn(`error on saving order`, e);
			}
		});
	};

	return (
		<Layout {...props}>
			{props.user.logged && (
				<>
					<Header user={props.user} title={cart.orderId ? 'Edita tu pedido' : 'Tu carrito'} cart={cart} />
					<Container className="cart-container">
						<Grid.Container justify="center" gap={2}>
							<Grid direction="column" xs={12} sm={10} md={7} lg={6} xl={4}>
								{cart.products.map((product: productType) => (
									<ProductDetailCard
										key={product._id}
										deleteProduct={(product: productType) => cart.deleteProduct(product)}
										updateProduct={(product: productType, qty) => cart.updateProduct({ ...product, qty })}
										product={product}
									/>
								))}
								<TotalCard total={cart.total} />
								{cart.isModified ? (
									<Button
										disabled={cart.products.length < 0}
										className={`${cart.products.length > 0 ? 'button-total' : 'button-total-disabled'}`}
										onClick={sendOrder}
									>
										{cart.orderId ? 'Actualizar pedido' : 'Realizar pedido'}
									</Button>
								) : null}
								<Button
									className="button-continue"
									onClick={() => {
										router.push('/');
									}}
								>
									Seguir comprando
								</Button>
							</Grid>
						</Grid.Container>
					</Container>
				</>
			)}
		</Layout>
	);
}
