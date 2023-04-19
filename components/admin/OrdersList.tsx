import { Badge, Table, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { FC, useContext, useState } from 'react';
import { SalesCtx, useSalesCtx } from '../../src/salescontext';
import { IconButton } from '../IconButton';
import { EyeIcon } from '../svg/EyeIcon';

type order = {
	email: string;
	total: number;
	userId: string;
	checked: boolean;
	controller: string;
	paymentType: string;
};

type props = {
	orders: order[];
};

const OrderList: FC<props> = ({ orders }) => {
	const router = useRouter();
	const { selectOrderByUser } = useContext(SalesCtx);
	const [orderControlled, setOrderControlled] = useState<'asc' | 'desc'>('asc');
	const [orderCashier, setOrderCashier] = useState<'asc' | 'desc'>('asc');
	const [orderPaymentType, setOrderPaymentType] = useState<'asc' | 'desc'>('asc');
	const [orderTotal, setOrderTotal] = useState<'asc' | 'desc'>('asc');

	const onDetail = userId => {
		selectOrderByUser(userId);
		router.push('detalle-de-compra');
	};

	const handleOrderControlled = () => {
		if (orderControlled === 'asc') {
			setOrderControlled('desc');
			orders.sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? -1 : 1));
		} else {
			setOrderControlled('asc');
			orders.sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));
		}
	};

	const handleOrderCashier = () => {
		if (orderCashier === 'asc') {
			setOrderCashier('desc');
			orders.sort((a, b) => (a.controller === b.controller ? 0 : a.controller ? -1 : 1));
		} else {
			setOrderCashier('asc');
			orders.sort((a, b) => (a.controller === b.controller ? 0 : a.controller ? 1 : -1));
		}
	};

	const handleOrderPaymentType = () => {
		if (orderPaymentType === 'asc') {
			setOrderPaymentType('desc');
			orders.sort((a, b) => (a.paymentType === b.paymentType ? 0 : a.paymentType ? -1 : 1));
		} else {
			setOrderPaymentType('asc');
			orders.sort((a, b) => (a.paymentType === b.paymentType ? 0 : a.paymentType ? 1 : -1));
		}
	};

	const handleOrderTotal = () => {
		if (orderTotal === 'asc') {
			setOrderTotal('desc');
			orders.sort((a, b) => (a.total === b.total ? 0 : a.total ? -1 : 1));
		} else {
			setOrderTotal('asc');
			orders.sort((a, b) => (a.total === b.total ? 0 : a.total ? 1 : -1));
		}
	};
	return (
		<div>
			<Table className="orders-table" onSortChange={e => console.log(e)}>
				<Table.Header>
					<Table.Column>Usuario</Table.Column>
					<Table.Column>
						<div onClick={handleOrderTotal}>Total</div>{' '}
					</Table.Column>
					<Table.Column>
						<div onClick={handleOrderControlled}>Controlado</div>
					</Table.Column>
					<Table.Column>
						<div onClick={handleOrderCashier}>Cajero/a</div>
					</Table.Column>
					<Table.Column>
						<div onClick={handleOrderPaymentType}>Forma de pago</div>
					</Table.Column>
					<Table.Column>Detalle</Table.Column>
				</Table.Header>
				<Table.Body>
					{orders.length >= 0
						? orders.map(order => {
								return (
									<Table.Row key={order.email}>
										<Table.Cell>{order.email}</Table.Cell>
										<Table.Cell>$ {order.total}</Table.Cell>
										<Table.Cell>
											{order.checked ? <Badge color="success"> Sí </Badge> : <Badge color="warning"> Pendiente </Badge>}
										</Table.Cell>
										<Table.Cell>{order.controller ? order.controller : '-'} </Table.Cell>
										<Table.Cell>{order.paymentType ? order.paymentType : '-'} </Table.Cell>
										<Table.Cell>
											<Tooltip content="Details">
												<IconButton onClick={() => onDetail(order.userId)}>
													<EyeIcon size={20} fill="#979797" />
												</IconButton>
											</Tooltip>
										</Table.Cell>
									</Table.Row>
								);
						  })
						: null}
				</Table.Body>
			</Table>
		</div>
	);
};

export default OrderList;
