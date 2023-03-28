import { Container, Grid, Loading } from '@nextui-org/react';
import Layout from '../layout';
import Header from '../../components/navigation/Header';
import UserOrdersList from '../../components/admin/UserOrderList';
import { useContext, useEffect, useState } from 'react';
import { getOrderBySale } from '../../helpers/content';
import { SalesCtx } from '../../src/salescontext';
export { getServerSideProps } from '../../src/ssp/admin';

interface CustomerOrder {
	email: string;
  }

export default function OrderDetail(props) {
	const { saleSelected, orderByUser } = useContext(SalesCtx);
	const [customerOrderList, setCustomerOrderList] = useState<CustomerOrder>();

	useEffect(() => {
		getOrderBySale(saleSelected._id).then(ordersBySales => {
			const customerOrder = ordersBySales.find(order => {
				return order.userId === orderByUser;
			});
			setCustomerOrderList(customerOrder);
		});
	}, []);

	return (
		<Layout>
			<Header user={props.user} title="Detalle de compra de:"  orderUserName={customerOrderList.email}></Header>
			<Container>
				{customerOrderList ? (
					<UserOrdersList orderList={customerOrderList} />
				) : (
					<Grid>
						<Loading type="points" />
					</Grid>
				)}
			</Container>
		</Layout>
	);
}
