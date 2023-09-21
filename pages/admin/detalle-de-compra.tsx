import { Badge, Container, Grid, Loading, Text } from '@nextui-org/react';
import Layout from '../../components/layouts/layout';
import Header from '../../components/navigation/Header';
import UserOrdersList from '../../components/admin/UserOrderList';
import { useContext, useEffect, useState } from 'react';
import { getOrderBySale } from '../../helpers/content';
import { SalesCtx } from '../../src/salescontext';
import toObjet from '../../src/helpers/toObjet';
export { getServerSideProps } from '../../src/ssp/admin';

interface CustomerOrder {
	email: string;
	checked: boolean;
	controller: string;
	paymentType: string;
}

export default function OrderDetail(props) {
	const { saleSelected, orderByUser } = useContext(SalesCtx);
	const [customerOrderList, setCustomerOrderList] = useState<CustomerOrder>();

	useEffect(() => {
		getOrderBySale(saleSelected._id, orderByUser).then(ordersBySales => {
			const result = JSON.parse(ordersBySales)
			setCustomerOrderList(result);
		});
	}, []);

	return (
		<Layout>
			<Header user={props.user} title="Detalle de compra de:" orderUserName={customerOrderList?.email}></Header>
			<Container>
				{customerOrderList ? (
					<>
						<Text b>
							Estado: {customerOrderList.checked ? <Badge color="success">Controlado</Badge> : <Badge>Pendiente</Badge>}
						</Text>
						{customerOrderList.checked ? (
							<>
								<div>
									<Text b>Cajero/a:</Text> {customerOrderList.controller}
								</div>
								<div>
									<Text b>Metodo de pago:</Text> {customerOrderList.paymentType}
								</div>
							</>
						) : null}
						<UserOrdersList orderList={customerOrderList} controller={props.user.name} />
					</>
				) : (
					<Grid>
						<Loading type="points" />
					</Grid>
				)}
			</Container>
		</Layout>
	);
}
