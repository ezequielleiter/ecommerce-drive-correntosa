import { Button, Card, Grid, Link, Row, Table, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../components/navigation/Header';
import { AlertIcon } from '../components/svg/AlertIcon';
import { statuSale, statusDate } from '../helpers/date';
import { getDateFormater, getDayFromDate } from '../helpers/formatDate';
import { infoMessages } from '../helpers/notify';
import { useSalesCtx } from '../src/salescontext';
import Layout from '../components/layouts/layout';
import moment from 'moment';
import { Fetch } from '../src/hooks/fetchHook';
export { getServerSideProps } from '../src/ssp/admin';

export default function Admin(props) {
	const [fechin, setFeching] = useState(true);
	const [rows, setRows] = useState(null);
	const [cells, setCells] = useState(null);
	const getPedidos = () => {
		Fetch({
			url: '/api/admin/get-pedidos',
			method: 'GET',
			onSuccess: response => {
				setRows(response.result.headers);
				setCells(response.result.result);
				setFeching(false);
			},
			onError: e => setFeching(false)
		});
	};
	useEffect(() => {
		getPedidos()
	}, [])
	
	return (
		<Layout>
			<Header title="Compras Activas" user={props.user} />
			<Grid.Container gap={2} justify="center">
				{fechin ? null : (
					<Table aria-label="Example static collection table">
						<Table.Header>
							{rows.map(r => (
								<Table.Column>{r}</Table.Column>
							))}
						</Table.Header>
						{/* <TableBody> */}
							{/* {cells.map(cell => (
								<TableRow key="1">
									<TableCell>Tony Reichert</TableCell>
									<TableCell>CEO</TableCell>
									<TableCell>Active</TableCell>
								</TableRow>
							))} */}
						{/* </TableBody> */}
					</Table>
				)}
			</Grid.Container>
		</Layout>
	);
}
