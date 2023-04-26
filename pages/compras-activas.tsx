import { Button, Card, Grid, Link, Row, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Header from '../components/navigation/Header';
import { AlertIcon } from '../components/svg/AlertIcon';
import { statuSale, statusDate } from '../helpers/date';
import { getDateFormater, getDayFromDate } from '../helpers/formatDate';
import { infoMessages } from '../helpers/notify';
import { useSalesCtx } from '../src/salescontext';
import Layout from './layout';
import moment from 'moment';
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
			const date = new Date(compra.closeDate);
			const fechaCierre = moment(date); // crea un objeto Moment a partir de la fecha inicial
			const hoy = moment(); // crea un objeto Moment con la fecha y hora actuales
			const diasTranscurridos = hoy.diff(fechaCierre, 'days');
			return diasTranscurridos > 30;
		});
	};

	function getColorHeader(status) {
		if (status === 'abierta') {
			return '#00AD8E';
		}
		if (status === 'proximamente') {
			return '#475161';
		}
		if (status === 'finalizada') {
			return '#A1A8B4';
		}
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
					compras.map(compra => (
						<Grid xs={12} sm={3}>
							<Card>
								<Card.Header
									style={{
										backgroundColor: getColorHeader(
											statuSale({ openDate: compra.openDate, closeDate: compra.closeDate })
										),
										justifyContent: 'space-between'
									}}
								>
									<Text b color="white">
										{statuSale({ openDate: compra.openDate, closeDate: compra.closeDate }, true)}
									</Text>
									<Text color="white">
										{statuSale({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'proximamente'
											? `Abre el ${getDateFormater(compra.closeDate).weekdayUppercase} ${
													getDateFormater(compra.closeDate).number
											  }`
											: statuSale({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'abierta'
											? `Cierra el ${getDateFormater(compra.closeDate).weekdayUppercase} a las ${
													getDateFormater(compra.closeDate).houre
											  }hs`
											: null}
									</Text>
								</Card.Header>
								<Card.Divider />
								<Card.Body>
									<Text color="#475161">Compra comunitaria</Text>
									<Text className="month-sale" color="#475161">
										{getDateFormater(compra.closeDate).monthName.toUpperCase()}
									</Text>
									<Text color="#475161" style={{ paddingTop: '1rem' }}>
										Entrega
									</Text>
									<Text className="day-delivery-bold" color="#475161">
										{getDateFormater(compra.deliveryDate).weekdayComplete}
									</Text>
									<Text className="day-delivery" color="#475161">
										de {compra.openDeliveryHour} a {compra.closeDeliveryHour}
									</Text>
									<Text color="#475161" style={{ paddingTop: '1rem' }}>
										Lugar de entrega
									</Text>
									<Link isExternal href={compra.locationUrl} target="_blank">
										{compra.locationName}
									</Link>
								</Card.Body>
								<Card.Divider />
								<Card.Footer>
									<Row justify="center">
										{compra.status === 'closed' ? (
											<Button bordered style={{ width: '100%' }} onClick={() => router.push('/mis-compras')}>
												VER COMPRA
											</Button>
										) : (
											<Button
												style={{ width: '100%' }}
												disabled={compra.status === 'toOpen' || compra.status === 'closed'}
												onClick={() => navigateProducts(compra)}
											>
												COMPRAR
											</Button>
										)}
									</Row>
								</Card.Footer>
							</Card>
						</Grid>
					))
				)}
			</Grid.Container>
		</Layout>
	);
}
