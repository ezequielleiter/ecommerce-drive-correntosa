import { Button, Container, Grid, Loading, Text } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { sheetOrder } from '../../src/global/types';
import { Fetch } from '../../src/hooks/fetchHook';
import MyPDF from '../pdf/SellerPagePdf';
import { FileSpreadsheet } from '../svg/FileSpreadsheet';
import { PdfIcon } from '../svg/PdfIcon';
import CustomModal from './CustomModal';
type props = {
	ordersCount: number;
	setOrdersCount(count: number): void;
	status: string;
	saleId: string;
};

const OrdersCount: FC<props> = ({ ordersCount, setOrdersCount, status, saleId }) => {
	const CERRADA = 'Cerrada';
	const [fetching, setFetching] = useState({ error: null, loading: false, done: false });
	// const [visibleModal, setVisibleModal] = useState(false);
	// const postOrdersOnSheets = async () => {
	// 	Fetch<{ orders: sheetOrder }>({
	// 		url: '/api/admin/orders',
	// 		method: 'POST',
	// 		onSuccess: () => {
	// 			setOrdersCount(0);
	// 			setFetching({ error: null, loading: false, done: true });
	// 		},
	// 		onError: () => {
	// 			setFetching({ error: 'Ocurrió un error enviando los pedidos', loading: false, done: true });
	// 		}
	// 	});
	// };

	const submitDowload = async saleId => {
		setFetching({ error: null, done: false, loading: true });
		fetch(`/api/orders/dowload-products?saleId=${saleId}&type=pdf`)
			.then(response => {
				return response.blob();
			})
			.then(blob => {
				setFetching({ error: null, done: true, loading: false });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'productos.pdf';
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.catch(error => {
				console.log(error);
			});
	};

	const submitDowloadExcel = async saleId => {
		setFetching({ error: null, done: false, loading: true });
		fetch(`/api/orders/dowload-products?saleId=${saleId}&type=excel`)
			.then(response => {
				return response.blob();
			})
			.then(blob => {
				setFetching({ error: null, done: true, loading: false });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'productos.xlsx';
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.catch(error => {
				console.log(error);
			});
	};

	return (
		<Container>
			<Grid.Container justify="center" direction="column" alignItems="center">
				<Text h3>Pedidos guardados hasta ahora (sin enviar)</Text>
				<Text h2>{ordersCount}</Text>
				{status === CERRADA ? (
					<div style={{display: "flex"}}>
						<Button
							onClick={() => submitDowload(saleId)}
							color="primary"
						>
							<PdfIcon /> Descargar pedidos en PDF
						</Button>
						<Button onClick={() => submitDowloadExcel(saleId)} color="success" className={fetching.loading ? 'button-total-disabled' : ''} style={{marginLeft: "1rem"}}>
							<FileSpreadsheet /> Descargar pedidos en Excel
						</Button>
					</div>
				) : null}
				{/* <Button
					disabled={status === 'open'}
					onClick={() => setVisibleModal(true)}
					className={fetching.loading || status === 'open' ? 'button-total-disabled' : 'button-total'}
				>
					Enviar pedidos
				</Button> */}
				{/* <CustomModal visible={visibleModal} close={() => setVisibleModal(false)} onConfirm={postOrdersOnSheets} /> */}
			</Grid.Container>
			<Grid.Container gap={2} direction="column" justify="center">
				{fetching.loading && <Loading color="warning"></Loading>}
				{fetching.done &&
					(fetching.error ? <Text color="error">{fetching.error}</Text> : <Text>Pedidos descargados con éxito</Text>)}
			</Grid.Container>
		</Container>
	);
};

export default OrdersCount;
