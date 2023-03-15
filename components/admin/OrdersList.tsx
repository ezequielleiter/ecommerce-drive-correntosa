import { Table, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import { SalesCtx, useSalesCtx } from '../../src/salescontext';
import { IconButton } from '../IconButton';
import { EyeIcon } from '../svg/EyeIcon';

type order = {
	email: string;
	total: number;
	userId: string;
};

type props = {
	orders: order[];
};

const OrderList: FC<props> = ({ orders }) => {
	const router = useRouter();
	const { selectOrderByUser } = useContext(SalesCtx);

	const onDetail = userId => {
		selectOrderByUser(userId);
		router.push('detalle-de-compra');
	};

	return (
		<div>
			<Table className="orders-table">
				<Table.Header>
					<Table.Column>Usuario</Table.Column>
					<Table.Column>Total</Table.Column>
					<Table.Column>Detalle</Table.Column>
				</Table.Header>
				<Table.Body>
					{orders.length >= 0 ? orders.map(order => {
						return (
							<Table.Row key={order.email}>
								<Table.Cell>{order.email}</Table.Cell>
								<Table.Cell>$ {order.total}</Table.Cell>
								<Table.Cell>
									<Tooltip content="Details">
										<IconButton onClick={() => onDetail(order.userId)}>
											<EyeIcon size={20} fill="#979797" />
										</IconButton>
									</Tooltip>
								</Table.Cell>
							</Table.Row>
						);
					}) : null}
				</Table.Body>
			</Table>
		</div>
	);
};

export default OrderList;
