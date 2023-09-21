import { useEffect, useState } from 'react';
import { Button, Container, Grid, Text } from '@nextui-org/react';
import Layout from '../../components/layouts/layout';
import Header from '../../components/navigation/Header';
import { infoMessages } from '../../helpers/notify';
import { statusDate } from '../../helpers/date';
import ComprasList from '../../components/admin/ComprasList';
import ModalCreateSale from '../../components/admin/ModalCreateSale';
import { Fetch } from '../../src/hooks/fetchHook';

export { getServerSideProps } from '../../src/ssp/admin';

export default function Admin(props) {
	const [productos, setProductos] = useState([]);
	const [modificadores, setModificadores] = useState([]);
	useEffect(() => {
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
		infoMessages();
		Promise.all([allModificadores, allProductos]);
	}, []);
	const compras = props.allSales.map(compra => {
		compra.status =
			statusDate({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'open'
				? 'Abierta'
				: statusDate({ openDate: compra.openDate, closeDate: compra.closeDate }) === 'toOpen'
				? 'Abre pronto'
				: 'Cerrada';
		return compra;
	});

	const [visible, setVisible] = useState(false);
	const handler = () => setVisible(true);
	return (
		<Layout>
			<Header user={props.user} title="Panel de administración"></Header>
			<Container>
				<Grid.Container justify="center" alignItems="center" gap={3} direction="column">
					<Text h1>Lista de compras</Text>
				</Grid.Container>
				{props.user.isSuperAdmin ? (
					<Grid.Container justify="flex-start" alignItems="flex-start" gap={3} direction="column">
						<Button onPress={handler}>Crear compra</Button>
					</Grid.Container>
				) : null}
				<ComprasList compras={compras} />
			</Container>
			<ModalCreateSale open={visible} setCreating={setVisible} productos={productos} modificadores={modificadores} />
		</Layout>
	);
}
