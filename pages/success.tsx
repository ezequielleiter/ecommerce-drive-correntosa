import Layout from '../components/layouts/layout';
import Header from '../components/navigation/Header';
import { Button, Container, Grid } from '@nextui-org/react';
import ProductDetailCard from '../components/cards/ProductDetailCard';
import TotalCard from '../components/cards/TotalCard';
import { ProductCart as productType } from '../src/global/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { infoMessages } from '../helpers/notify';
import { Fetch } from '../src/hooks/fetchHook';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useAppCtx } from '../src/context';
export { getServerSideProps } from '../src/ssp/cart';

export default function Cart(props) {
	const isEditingOrder = props.orderId !== null;
	const cart = useAppCtx();
	const router = useRouter();

	useEffect(() => {
		infoMessages();
	}, []);

	const sendOrder = async () => {
		if (!cart.products.length) {
			console.warn(`No puedes actualizar tu orden sin productos`);
			return;
		}
		Fetch<{ products: Array<productType>; total: number }>({
			url: `/api/orders${isEditingOrder ? `/${props.orderId}` : ''}`,
			method: `${isEditingOrder ? 'PUT' : 'POST'}`,
			data: { products: cart.products, total: cart.total },
			onSuccess: () => {
				toast.warn(`Su pedido se ha ${isEditingOrder ? 'modificado' : 'realizado'} con éxito`, {
					icon: <FontAwesomeIcon icon={faCheckCircle} color="#EA903C" />
				});
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
					<Header user={props.user} title={isEditingOrder ? 'Su pedido se actualizo existosamente' : 'Pedido exitoso'} cart={cart} />
					<Container className="cart-container">
					</Container>
				</>
			)}
		</Layout>
	);
}
