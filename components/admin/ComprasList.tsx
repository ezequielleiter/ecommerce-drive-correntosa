import { Badge, Table, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { statusDate } from '../../helpers/date';
import { getDayFromDate } from '../../helpers/formatDate';
import { useSalesCtx } from '../../src/salescontext';
import { IconButton } from '../IconButton';
import { EyeIcon } from '../svg/EyeIcon';

type order = {
	email: string;
	total: number;
	_id: string;
	name: string;
	openDate: string;
	closeDate: string;
	status: string;
	deliveryDate: string;
	locationName: string;
};

type props = {
	compras: order[];
};

const ComprasList: FC<props> = ({ compras }) => {
	const sale = useSalesCtx();
	const router = useRouter();
	const navigateCompra = compra => {
		sale.selectSale(compra);
		router.push('/admin/compra');
	};
	return (
		<div>
			<Table className="compras-table">
				<Table.Header>
					<Table.Column>Estado</Table.Column>
					<Table.Column>Nombre</Table.Column>
					<Table.Column>Abre</Table.Column>
					<Table.Column>Cierra</Table.Column>
					<Table.Column>Dia de entrega</Table.Column>
					<Table.Column>Lugar de entrega</Table.Column>
					<Table.Column>Acciones</Table.Column>
				</Table.Header>
				<Table.Body>
					{compras.map(compra => {
						return (
							<Table.Row key={compra._id}>
								<Table.Cell>
									<Badge
										color={
											statusDate({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'open'
												? 'success'
												: statusDate({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'toOpen'
												? 'warning'
												: 'error'
										}
									>
										{compra.status}
									</Badge>
								</Table.Cell>
								<Table.Cell>{compra.name}</Table.Cell>
								<Table.Cell>{getDayFromDate(compra.openDate)}</Table.Cell>
								<Table.Cell>{getDayFromDate(compra.closeDate)}</Table.Cell>
								<Table.Cell>{compra.deliveryDate}</Table.Cell>
								<Table.Cell>{compra.locationName}</Table.Cell>
								<Table.Cell>
									<Tooltip content="Details">
										<IconButton onClick={() => navigateCompra(compra)}>
											<EyeIcon size={20} fill="#979797" />
										</IconButton>
									</Tooltip>
								</Table.Cell>
							</Table.Row>
						);
					})}
				</Table.Body>
			</Table>
		</div>
	);
};

export default ComprasList;
