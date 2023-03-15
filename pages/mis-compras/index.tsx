import { Button, Card, Col, Container, Grid, Modal, Row, Table, Text, Tooltip, useModal, User } from '@nextui-org/react';
import { useEffect, useReducer, useState } from 'react';
import { IconButton } from '../../components/IconButton';
import Header from '../../components/navigation/Header';
import { AlertIcon } from '../../components/svg/AlertIcon';
import { CancelIcon } from '../../components/svg/CancelIcon';
import { CheckIcon } from '../../components/svg/CheckIcon';
import { EyeIcon } from '../../components/svg/EyeIcon';
import { getOrderByUser } from '../../helpers/content';
import { infoMessages } from '../../helpers/notify';
import Layout from '../layout';
export { getServerSideProps } from '../../src/ssp/admin';

const counterContext = {
	list: []
};

function listReducer(state, action) {
	switch (action.type) {
		case 'SET_LIST':
			return {
				...state,
				list: action.products
			};
		case 'CHECK_PRODUCT':
			return {
				...state,
				list: action.list
			};
		default:
			return state;
	}
}

export default function Admin(props) {
	const [state, dispatch] = useReducer(listReducer, counterContext);
	const { list } = state;
	const [userOrders, setUserOrders] = useState([]);
	const [allSelect, setAllSelect] = useState(false);
	const { setVisible, bindings } = useModal();
	useEffect(() => {
		infoMessages();
		getOrderByUser(props.user.id).then(orders => setUserOrders(orders));
	}, []);

	const allCheck = list => {
		const allSelect = list.every(product => product.hasOwnProperty('check'));
		if (allSelect) {
			setAllSelect(allSelect);
		}
	};

	const onShowDetail = orderId => {
		setVisible(true);
		const orderToShow = userOrders.find(order => {
			return order._id === orderId;
		});
		dispatch({ type: 'SET_LIST', products: orderToShow.products });
	};

	const onCheckProduct = productId => {
		let listToUpdate = [];
		listToUpdate = list;
		const productToCheck = list.findIndex(product => {
			return product._id === productId;
		});
		listToUpdate[productToCheck].check = true;
		dispatch({ type: 'CHECK_PRODUCT', list: listToUpdate });
		allCheck(listToUpdate);
	};

	const unCheckProduct = productId => {
		let listToUpdate = [];
		listToUpdate = list;
		const productToCheck = list.findIndex(product => {
			return product._id === productId;
		});
		listToUpdate[productToCheck].check = false;
		dispatch({ type: 'CHECK_PRODUCT', list: listToUpdate });
		allCheck(listToUpdate);
	};

	return (
		<Layout>
			<Header title="Mis compras" user={props.user} />
			<Grid.Container gap={2} justify="center" >
				<Card css={{ mw: "600px", backgroundColor:"#ffff00", alignItems: "center"}}>
					<Card.Body>
						<AlertIcon color='grey' height='50' width='50'/>
						<Text color='grey' weight="bold" css={{textAlign: "center"}}>Acá solo vas a ver la lista de las compras que ya realizaste y te quedan por retirar</Text>
					</Card.Body>
				</Card>
			</Grid.Container>
			<Grid.Container gap={2} justify="center">
				<Table
					aria-label="Example table with static content"
					css={{
						height: 'auto',
						minWidth: '100%'
					}}
				>
					<Table.Header>
						<Table.Column>Compra</Table.Column>
						<Table.Column>Total</Table.Column>
						<Table.Column> </Table.Column>
					</Table.Header>
					<Table.Body>
						{userOrders.map(order => (
							<Table.Row key={order.saleId}>
								<Table.Cell>{order.saleId}</Table.Cell>
								<Table.Cell>$ {order.total}</Table.Cell>
								<Table.Cell>
									<Tooltip content="Ver compra">
										<IconButton onClick={() => onShowDetail(order._id)}>
											<EyeIcon size={20} fill="#979797" />
										</IconButton>
									</Tooltip>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</Grid.Container>
			<div>
				<Modal
					scroll
					fullScreen
					closeButton
					aria-labelledby="modal-title"
					aria-describedby="modal-description"
					{...bindings}
				>
					<Modal.Header>
						<Text id="modal-title" size={25} weight="bold">
							Controla tu pedido
						</Text>
					</Modal.Header>
					<Modal.Body>
						<Grid.Container gap={2} justify="center">
							{(list || []).map(product => (
								<Grid>
									<Card
										css={{
											w: '80vw',
											h: '400px',
											backgroundColor: `${
												product.check === true ? '#a9f393' : product.check === false ? '#ff9b76' : ''
											}`
										}}
									>
										<Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
											<Col>
												<Text h3 color="black">
													{product.name}
												</Text>
											</Col>
										</Card.Header>
										<Card.Body css={{ p: 0 }}>
											<Card.Image src={product.picture} width="100%" height="100%" alt={product.name} />
										</Card.Body>
										<Card.Footer
											isBlurred
											css={{
												position: 'absolute',
												bgBlur: '#ffffff66',
												borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
												bottom: 0,
												zIndex: 1
											}}
										>
											<Row>
												<Col>
													<Text color="#000" size={30} weight="bold">
														x {product.qty}
													</Text>
												</Col>
												<Col>
													<Row justify="flex-end">
														<Button
															onClick={() => onCheckProduct(product._id)}
															auto
															color="success"
															style={{ marginRight: 20 }}
															icon={<CheckIcon />}
														/>
														<Button
															onClick={() => unCheckProduct(product._id)}
															auto
															color="error"
															icon={<CancelIcon />}
														/>
													</Row>
												</Col>
											</Row>
										</Card.Footer>
									</Card>
								</Grid>
							))}
						</Grid.Container>
					</Modal.Body>
					<Modal.Footer>
						<Button flat auto color="error" onPress={() => setVisible(false)}>
							Cerrar
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
			<Modal closeButton open={allSelect} onClose={() => setAllSelect(false)} css={{ margin: '0 24px 0 24px' }}>
				<Modal.Body>
					<Text h3 color="#0000a9" css={{ textAlign: 'center' }}>
						¡Ya terminaste de armar tu pedido!
					</Text>
					<Text h4 css={{ textAlign: 'center' }}>
						Ahora podes ir a la caja asi lo revisamos
					</Text>
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
		</Layout>
	);
}
