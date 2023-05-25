import { useContext, useEffect, useState } from 'react';
import { Container, Grid } from '@nextui-org/react';
import Layout from '../layout';
import Header from '../../components/navigation/Header';
import CartDatesForm from '../../components/admin/CartDatesForm';
import OrdersCount from '../../components/admin/OrdersCount';
import CurrentStatus from '../../components/admin/CurrentStatus';
import { infoMessages } from '../../helpers/notify';
import OrdersList from '../../components/admin/OrdersList';
import UpdateProductToSaleBtn from '../../components/admin/UpdateProductToSaleBtn';
import { SalesCtx } from '../../src/salescontext';
import { useRouter } from 'next/router';
import { getOrderBySale } from '../../helpers/content';
import { statusDate } from '../../helpers/date';
import { Fetch } from '../../src/hooks/fetchHook';
export { getServerSideProps } from '../../src/ssp/admin';

export default function Admin(props) {
	const [editingDates, setEditingDates] = useState(false);
	const [saleStatus, setSaleStatus] = useState('');
	const [ordersCount, setOrdersCount] = useState(0);
	const [currentStatus, setCurrentStatus] = useState(props.currentStatus);
	const [orderBySale, setorderBySale] = useState([]);
	const { saleSelected } = useContext(SalesCtx);
	const [modificadores, setModificadores] = useState([])
	const [productos, setProductos] = useState([])
	const router = useRouter();

	useEffect(() => {
		if (saleSelected._id.length === 0) {
			router.push('/admin');
		}
		const allModificadores = Fetch({
			url: `/api/modificadores`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar tags`, e);
			},
			onSuccess: res => {
				setModificadores(res);
			}
		});

		const allProductos = Fetch({
			url: `/api/products`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar tags`, e);
			},
			onSuccess: res => {
				setProductos(res.products);
			}
		});
		getOrderBySale(saleSelected._id).then(ordersBySale => {
			setorderBySale(ordersBySale);
			setOrdersCount(ordersBySale.length);
		});
		infoMessages();
		const dateStatus = statusDate({ openDate: saleSelected.openDate, closeDate: saleSelected.closeDate });
		Promise.all([allModificadores, allProductos]);
		setSaleStatus(dateStatus);
	}, []);

	return (
		<Layout>
			<Header user={props.user} title={saleSelected.name}></Header>
			<Container>
				<Grid.Container css={{ width: '100%' }}  alignItems="center" gap={1} direction="column">
					{/* {saleStatus === 'closed' ? null : saleSelected._id && props.user.isSuperAdmin ? (
						<Grid>
							<UpdateProductToSaleBtn saleID={saleSelected._id} />
						</Grid>
					) : null} */}
					<Grid xs={12} sm={12} md={12} lg={12}>
						{editingDates ? (
							<CartDatesForm
								setEditing={setEditingDates}
								setCurrentStatus={setCurrentStatus}
								initialStatus={saleSelected}
								productos={productos}
								modificadores={modificadores}
							/>
						) : (
							<CurrentStatus status={currentStatus} setEditing={setEditingDates} saleSelect={saleSelected} isSuperAdmin={props.user.isSuperAdmin}/>
						)}
					</Grid>
					<Grid xs={12} sm={10} md={8} lg={6}>
						<OrdersCount
							ordersCount={ordersCount}
							setOrdersCount={setOrdersCount}
							status={saleSelected.status}
							saleId={saleSelected._id}
						/>
					</Grid>
				</Grid.Container>
				{orderBySale.length === 0 ? null : <OrdersList orders={orderBySale} />}
			</Container>
		</Layout>
	);
}
