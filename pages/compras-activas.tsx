import { Badge, Button, Card, Grid, Link, Row, Spacer, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Header from '../components/navigation/Header';
import { AlertIcon } from '../components/svg/AlertIcon';
import { statusDate } from '../helpers/date';
import { getDayFromDate } from '../helpers/formatDate';
import { infoMessages } from '../helpers/notify';
import { useSalesCtx } from '../src/salescontext';
import Layout from './layout';
export { getServerSideProps } from '../src/ssp/admin';

export default function Admin(props) {
	const sale = useSalesCtx();
	const router = useRouter();
	const navigateProducts = compra => {
		sale.selectSale(compra);
		router.push('/products');
	};

	useEffect(() => infoMessages(), []);
	const compras = props.allSales.map(compra => {
		compra.status = statusDate({ openDate: compra.openDate, closeDate: compra.closeDate });
		return compra;
	});

	const allCompraIsClose = compras => {
		return compras.every(compra => {
			compra.status === 'close';
		});
	};

	function getDay(date) {
		const fecha = new Date(date);
		const opciones = { weekday: 'long' };
		const dia = fecha.getDate();
		const mes = fecha.toLocaleString('default', { month: 'long' });
		const diaDeLaSemana = fecha.toLocaleDateString('es-AR', opciones);
		return `${diaDeLaSemana} ${dia} de ${mes}`;
	}

	return (
		<Layout>
			<Header title="Compras Activas" user={props.user} />
			<Grid.Container gap={2} justify="center">
				{allCompraIsClose(compras) ? (
					<Grid.Container gap={2} justify="center">
						<Card css={{ mw: '600px', backgroundColor: '#ffff00', alignItems: 'center' }}>
							<Card.Body>
								<AlertIcon color="grey" height="50" width="50" />
								<Text color="grey" weight="bold" css={{ textAlign: 'center' }}>
									Por el momento no hay compras activas
								</Text>
							</Card.Body>
						</Card>
					</Grid.Container>
				) : (
					compras.map(compra =>
						compra.status === 'closed' ? null : (
							<Grid>
								<Card>
									<Card.Header style={{ justifyContent: 'space-between' }}>
										<Text b>{compra.name}</Text>
										<Badge
											color={
												statusDate({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'open'
													? 'success'
													: statusDate({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'toOpen'
													? 'warning'
													: 'error'
											}
										>
											{statusDate({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'open'
												? 'Abierta'
												: statusDate({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'toOpen'
												? 'Abre pronto'
												: 'error'}
										</Badge>
									</Card.Header>
									<Card.Divider />
									<Card.Body>
										<Text>
											Podes comprar desde el {getDayFromDate(compra.openDate)} hasta el{' '}
											{getDayFromDate(compra.closeDate)}
										</Text>
									</Card.Body>
									<Card.Divider />
									<Card.Body>
										<Text weight="bold" css={{ textAlign: 'center' }}>
											Entrega
										</Text>
										<Spacer />
										<Text weight="bold" css={{ textAlign: 'center' }}>
											{getDay(compra.deliveryDate)} de {compra.openDeliveryHour} a {compra.closeDeliveryHour}
										</Text>
										<Spacer />
										<Text weight="bold" css={{ textAlign: 'center' }}>
											Lugar de entrega
										</Text>
										<Spacer />
										<Link block isExternal href={compra.locationUrl} target="_blank">
											{compra.locationName}
										</Link>
									</Card.Body>
									<Card.Divider />
									<Card.Footer>
										<Row justify="center">
											<Button disabled={compra.status === 'toOpen'} onClick={() => navigateProducts(compra)}>
												{compra.status === 'toOpen' ? 'Abre pronto' : 'Ir a comprar'}
											</Button>
										</Row>
									</Card.Footer>
								</Card>
							</Grid>
						)
					)
				)}
			</Grid.Container>
		</Layout>
	);
}
