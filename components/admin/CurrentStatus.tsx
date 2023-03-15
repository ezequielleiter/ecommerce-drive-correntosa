import { Button, Container, Grid, Text } from '@nextui-org/react';
import { FC } from 'react';
import { statusDate } from '../../helpers/date';
import { getDayFromDate, getTimeFromDate } from '../../helpers/formatDate';
import { statusCart } from '../../src/global/types';

type props = {
	status: statusCart;
	setEditing(editing: boolean): void;
	saleSelect: any;
};

const CurrentStatus: FC<props> = ({ status, setEditing, saleSelect }) => {
	const dateStatus = statusDate({ openDate: saleSelect.openDate, closeDate: saleSelect.closeDate });

	return (
		<Container>
			<Text h1>{saleSelect.name}</Text>
			<Grid.Container justify="center" direction="column" alignItems="center">
				<Text h4 color={dateStatus === 'open' ? 'success' : dateStatus === 'toOpen' ? 'warning' : 'error'}>
					{dateStatus === 'open' ? 'Abierta' : dateStatus === 'toOpen' ? 'Abre pronto' : 'Cerrada'}
				</Text>
				<Grid>
					<Text>
						Abre: <strong>{getDayFromDate(saleSelect.openDate)}</strong> a las{' '}
						<strong>{getTimeFromDate(saleSelect.openDate)}</strong>
					</Text>
				</Grid>
				<Grid>
					<Text>
						Cierra: <strong>{getDayFromDate(saleSelect.closeDate)}</strong> a las{' '}
						<strong>{getTimeFromDate(saleSelect.closeDate)}</strong>
					</Text>
				</Grid>
				{dateStatus === 'closed' ? null : (
					<Button onClick={() => setEditing(true)} className="button-total">
						Editar compra
					</Button>
				)}
			</Grid.Container>
		</Container>
	);
};

export default CurrentStatus;
