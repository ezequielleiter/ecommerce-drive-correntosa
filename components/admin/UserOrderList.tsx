import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { Table, User, Button, Text, Modal, Radio, Input } from '@nextui-org/react';

const counterContext = {
	order: {}
};

function orderReducer(state, action) {
	switch (action.type) {
		case 'SET_PRODUCT':
			return {
				...state,
				order: action.products
			};
		case 'ADD_PRODUCT':
			state.order.total = action.total;
			state.order.products = action.products;
			return {
				...state
			};
		default:
			return state;
	}
}

const UserOrderList = ({ orderList }) => {
	const [state, dispatch] = useReducer(orderReducer, counterContext);
	const [productCheck, setProductCheck] = useState(0);
	const [visible, setVisible] = useState(false);
	const handler = () => setVisible(true);
	const [paymentType, setPaymentType] = useState('');
	const { order } = state;

	useEffect(() => {
		dispatch({ type: 'SET_PRODUCT', products: orderList });
	}, []);

	const handleMoreProduct = (productId, qty) => {
		let listProductToUpdate = order.products;
		const indexProduct = order.products.findIndex(product => product._id.toString() === productId);
		listProductToUpdate[indexProduct].qty = qty + 1;
		listProductToUpdate[indexProduct].total =
			listProductToUpdate[indexProduct].price * listProductToUpdate[indexProduct].qty;
		const sumTotals = products => products.reduce((total, product) => product.total + total, 0);
		const sumaTotal = sumTotals(listProductToUpdate);
		dispatch({ type: 'ADD_PRODUCT', products: listProductToUpdate, total: sumaTotal });
	};

	const handleLessProduct = (productId, qty) => {
		if (qty === 0) {
			return;
		}
		let listProductToUpdate = order.products;
		const indexProduct = order.products.findIndex(product => product._id.toString() === productId);
		listProductToUpdate[indexProduct].qty = qty - 1;
		listProductToUpdate[indexProduct].total =
			listProductToUpdate[indexProduct].price * listProductToUpdate[indexProduct].qty;
		const sumTotals = products => products.reduce((total, product) => product.total + total, 0);
		const sumaTotal = sumTotals(listProductToUpdate);
		dispatch({ type: 'ADD_PRODUCT', products: listProductToUpdate, total: sumaTotal });
	};

	const handleSelectionChange = e => {
		const totalProductCheck = Array.from(e);
		setProductCheck(totalProductCheck.length);
	};

	const closeHandler = () => {
		setVisible(false);
		console.log('closed');
	};

	return (
		<>
			<Table
				aria-label="Lista de productos"
				color="success"
				selectionMode="multiple"
				onSelectionChange={handleSelectionChange}
				css={{
					height: 'auto',
					minWidth: '100%'
				}}
			>
				<Table.Header>
					<Table.Column>Producto</Table.Column>
					<Table.Column>Cantidad</Table.Column>
					<Table.Column>Precio x U</Table.Column>
					<Table.Column>Total</Table.Column>
				</Table.Header>
				<Table.Body>
					{(order?.products || []).map(product => (
						<Table.Row key={product._id.toString()}>
							<Table.Cell>
								<User squared src={product.picture} name={product.name} />
							</Table.Cell>
							<Table.Cell>
								<div style={{ display: 'flex' }}>
									<Button
										rounded
										color="error"
										auto
										size="xs"
										onPress={() => {
											handleLessProduct(product._id.toString(), product.qty);
										}}
									>
										-
									</Button>
									<p style={{ padding: '0 1rem' }}>{product.qty}</p>
									<Button
										rounded
										color="success"
										auto
										size="xs"
										onPress={() => {
											handleMoreProduct(product._id.toString(), product.qty);
										}}
									>
										+
									</Button>
								</div>
							</Table.Cell>
							<Table.Cell>$ {product.price}</Table.Cell>
							<Table.Cell>$ {product.total}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
			<Text css={{ marginTop: '2rem' }} size="$3xl" weight="bold">
				Total: $ {order?.total}
			</Text>
			<Button disabled={order?.products?.length !== productCheck} onClick={() => setVisible(true)}>
				Pagar
			</Button>
			<Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
				<Modal.Header>
					<Text id="modal-title" size={18}>
						Welcome to
						<Text b size={18}>
							NextUI
						</Text>
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Radio.Group label="Forma de pago" value={paymentType} onChange={setPaymentType}>
						<Radio value="debito">Debito</Radio>
						<Radio value="efectivo">Efectivo</Radio>
						<Radio value="trasferencia">Trasferencia</Radio>
						<Radio value="otro">Otro</Radio>
					</Radio.Group>
					{paymentType === 'otro' ? <Input placeholder="Por favor, indique de que manera va a abonar" /> : null}
				</Modal.Body>
				<Modal.Footer>
					<Button auto flat color="error" onPress={closeHandler}>
						Close
					</Button>
					<Button auto onPress={closeHandler}>
						Sign in
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default UserOrderList;
