import { Button, Container, Divider, Grid, Loading, Modal, Text } from '@nextui-org/react';
import { FC, useState } from 'react';
import { FileSpreadsheet } from '../svg/FileSpreadsheet';
import { PdfIcon } from '../svg/PdfIcon';
type props = {
	ordersCount: number;
	setOrdersCount(count: number): void;
	status: string;
	saleId: string;
	orders: any[];
};

type Order = {
	checked: boolean,
	total: number
}

const OrdersCount: FC<props> = ({ ordersCount, setOrdersCount, status, saleId, orders }) => {
	const CERRADA = 'Cerrada';

	const [fetching, setFetching] = useState({ error: null, loading: false, done: false });
	const [visible, setVisible] = useState(false);
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

	const handler = () => setVisible(true);

	const closeHandler = () => {
		setVisible(false);
		console.log('closed');
	};

	const ordersChecked = orders.filter((o: Order) => o.checked === true);
	const ordersNotChecked = orders.filter((o: Order) => o.checked === false);
	const saleTotal = orders.reduce((total, order: Order) => total + order.total, 0);

	const resumePagos = orders => {
		let debito = 0;
		let efectivo = 0;
		let otro = 0;
		orders.forEach(order => {
			if (order.checked) {
				if (order.paymentType === 'debito') {
					debito += order.total;
					return;
				}
				if (order.paymentType === 'efectivo') {
					efectivo += order.total;
					return;
				}
				if (order.paymentType === 'transferencia') {
					debito += order.total;
					return;
				}
				if (order.paymentType === 'otro') {
					otro += order.total;
					return;
				}
			}
		});

		return {
			debito,
			efectivo,
			otro
		};
	};

	const pagos = resumePagos(orders);
	return (
		<Container>
			<Grid.Container justify="center" direction="column" alignItems="center">
					<>
						<Button onClick={handler} color="warning" css={{ marginBottom: 10 }}>
							Resumen de la compra
						</Button>
						<div style={{ display: 'flex' }}>
							<Button onClick={() => submitDowload(saleId)} color="primary">
								<PdfIcon /> Descargar pedidos en PDF
							</Button>
							<Button
								onClick={() => submitDowloadExcel(saleId)}
								color="success"
								className={fetching.loading ? 'button-total-disabled' : ''}
								style={{ marginLeft: '1rem' }}
							>
								<FileSpreadsheet /> Descargar pedidos en Excel
							</Button>
						</div>
					</>
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
			<Modal closeButton fullScreen aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
				<Modal.Header>
					<Text id="modal-title" size={18}>
						Resumen de compra
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Text id="modal-title" size={18}>
						Total de pedidos: {orders.length}
					</Text>
					<Text id="modal-title" size={18}>
						Pedidos controlados: {ordersChecked.length}
					</Text>
					<Text id="modal-title" size={18}>
						Pedidos faltantes: {ordersNotChecked.length}
					</Text>
					<Divider />
					<Text id="modal-title" size={18}>
						Total de la compra: ${saleTotal}
					</Text>
					<Text id="modal-title" size={18}>
						Pagos en efectivo: ${pagos.efectivo}
					</Text>
					<Text id="modal-title" size={18}>
						Pagos en debito/transferencia: ${pagos.debito}
					</Text>
					<Text id="modal-title" size={18}>
						Otros pagos: ${pagos.otro}
					</Text>
				</Modal.Body>
				<Modal.Footer>
					<Button auto flat color="error" onPress={closeHandler}>
						Close
					</Button>
					<Button auto flat color="warning" onPress={closeHandler}>
						Archivar compra
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default OrdersCount;
