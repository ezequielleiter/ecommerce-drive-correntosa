import { Avatar, Button, Grid, Input, Modal, Table, Text, Radio } from '@nextui-org/react';
import { FC, useEffect, useReducer, useState } from 'react';
import { createSaleType, errorsFormType, orderData } from '../../src/global/types';
import { Fetch } from '../../src/hooks/fetchHook';
import { useFormValidation } from '../../src/hooks/formHook';
import { formatDate, getMinCloseDate } from '../../helpers/date';
import { useSalesCtx } from '../../src/salescontext';
import { useRouter } from 'next/router';
import calculateFinalPrice from '../../src/helpers/prices/calculateFinalPrice';
import sumTotals from '../../src/helpers/sumTotal';

type props = {
	// setCurrentStatus(status: statusCart): void;
	// initialStatus: any;
	open: boolean;
	productos: any[];
	modificadores: any[];
	bindings: any;
	setVisible(status: boolean): void;
	controller: string;
};

const initialFormFields: orderData = {
	products: [],
	total: 0,
	checked: false,
	controller: '',
	paymentType: ''
};
const initialFormErrors: errorsFormType = {};

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

const counterContext = {
	order: {
		products: [],
		userId: '',
		total: 0,
		saleId: '',
		email: ''
	}
};

const ModalAgregarCompra: FC<props> = ({ open, productos, modificadores, setVisible, bindings, controller }) => {
	const sale = useSalesCtx();
	const [state, dispatch] = useReducer(orderReducer, counterContext);
	const { order } = state;
	const router = useRouter();
	const form = useFormValidation<orderData>(initialFormFields);
	const [errors, setErrors] = useState(initialFormErrors);
	const [fetching, setFetching] = useState({ error: null, loading: false, done: false });
	const [productsIds, setProductsIds] = useState([]);
	const [paymentType, setPaymentType] = useState('');
	const [email, setEmail] = useState('');
	const [userId, setuserId] = useState('');
	const today = formatDate(new Date());
	const handleChangeField = (e, property: keyof orderData) => {
		const value = e.target.value;
		form.setValue(property, value);
	};

	const submitDates = () => {
		setFetching({ error: null, done: false, loading: true });
		Fetch<createSaleType>({
			url: '/api/admin/cart/dates',
			method: 'POST',
			data: {
				...form.fields,
				openDate: form.fields.openDate.replace('.000Z', ''),
				closeDate: form.fields.closeDate.replace('.000Z', ''),
				name: form.fields.name,
				deliveryDate: form.fields.deliveryDate,
				openDeliveryHour: form.fields.openDeliveryHour,
				closeDeliveryHour: form.fields.closeDeliveryHour,
				locationName: form.fields.locationName,
				locationUrl: form.fields.locationUrl,
				productsIds
			},
			onSuccess: response => {
				// sale.selectSale(response);
				setFetching({ error: null, loading: false, done: true });
			},
			onError: e => setFetching({ error: 'Ocurrió un error enviando las fechas', loading: false, done: true })
		});
		router.reload();
	};

	const validate = () => {
		let localErrors: errorsFormType = form.validateFields({
			openDate: 'Debe ingresar una fecha de apertura',
			closeDate: 'Debe ingresar una fecha de cierre',
			name: 'Debe ingresar un nombre',
			deliveryDate: 'Debe ingresar una fecha de entrega',
			openDeliveryHour: 'Debe ingresar una hora de entrega',
			closeDeliveryHour: 'Debe ingresar una hora de cierre',
			locationName: 'Debe ingresar el nombre del lugar de entrega',
			locationUrl: 'Debe ingresar el link del lugar de entrega',
			productsIds: 'Debe ingresar almenos un producto'
		});
		const validateIntervalDates = new Date(form.closeDate) <= new Date(form.openDate);
		if (localErrors || validateIntervalDates) {
			setErrors(localErrors ?? { openDate: 'La fecha de cierre debe ser mayor que la de apertura' });
		}

		return !localErrors;
	};

	const findModificadores = modificadoresIds => {
		const completeModificadores = [];
		modificadoresIds.forEach(modificadorId => {
			const findCompleteModificador = modificadores.find(m => m._id.toString() === modificadorId);
			if (findCompleteModificador) {
				completeModificadores.push(findCompleteModificador);
			}
		});
		return completeModificadores;
	};

	const handleSelectionChange = e => {
		if (e === 'all') {
			const allProductsIdToAdd = productos.filter(_p => _p.stock).map(p => p._id.toString());
			setProductsIds(allProductsIdToAdd);
			form.setValue('productsIds', productsIds);
		} else {
			const productsIdToAdd = Array.from(e);
			setProductsIds(productsIdToAdd);
			form.setValue('productsIds', productsIds);
		}
	};

	const handleLessProduct = (productId, qty) => {
		if (qty === 0) {
			return;
		}
		let listProductToUpdate = order.products;
		const indexProduct = order.products.findIndex(product => product._id.toString() === productId);
		listProductToUpdate[indexProduct].qty -= 1;
		const sumaTotal = sumTotals(listProductToUpdate);
		dispatch({ type: 'ADD_PRODUCT', products: listProductToUpdate, total: sumaTotal });
	};

	const handleMoreProduct = (productId, qty: 0) => {
		let listProductToUpdate = order.products;
		const indexProduct = order.products.findIndex(product => product._id.toString() === productId);
		if (indexProduct === -1) {
			const producto = productos.find(p => p._id.toString() === productId);
			if (producto) {
				const newProduct = { ...producto, qty: 1 };
				listProductToUpdate.push(newProduct);
			}
		} else {
			listProductToUpdate[indexProduct].qty += 1;
			const sumaTotal = sumTotals(listProductToUpdate);
			dispatch({ type: 'ADD_PRODUCT', products: listProductToUpdate, total: sumaTotal });
		}
	};

	const cantidadPorProduct = productId => {
		const producto = order.products.find(p => p._id === productId);
		if (producto) {
			return producto.qty;
		}
		return 0;
	};

	const controlOrder = async order => {
		if (!order.products.length) {
			console.warn(`No puedes actualizar tu orden sin productos`);
			return;
		}

		const testProduct = order.products.map(p => {
			const producto = {
				name: p.name,
				finalPrice: p.finalPrice,
				qty: p.qty,
				picture: p.picture,
				productId: p._id
			};
			return producto;
		});
		console.log(testProduct);

		const closedOrder = order;
		closedOrder.paymentType = paymentType;
		closedOrder.checked = true;
		closedOrder.controller = controller;
		closedOrder.saleId = sale.saleSelected._id;
		closedOrder.email = email;
		closedOrder.userId = userId;
		console.log(closedOrder);
		Fetch({
			url: `/api/orders/${order._id}`,
			method: 'POST',
			query: "compraExterna",
			data: {
				closedOrder
			},
			onError: e => {
				console.warn(`error on saving order`, e);
			},
			onSuccess: () => router.push('/admin')
		});
	};
	return (
		<>
			<Modal scroll width="600px" aria-labelledby="modal-title" aria-describedby="modal-description" {...bindings}>
				<Modal.Body>
					<Input label="Email del usuario" value={email} onChange={e => setEmail(e.target.value)} />
					<Input label="Id del usuario" value={userId} onChange={e => setuserId(e.target.value)} />
					<div>
						<Table
							aria-label="Example table with static content"
							css={{ minWidth: '100%', height: 'calc($space$14 * 10)' }}
							compact
							lined
							headerLined
							shadow={false}
							sticked
							// onSelectionChange={handleSelectionChange}
						>
							<Table.Header>
								<Table.Column>Nombre</Table.Column>
								<Table.Column>Cantidad</Table.Column>
								<Table.Column>Precio venta</Table.Column>
							</Table.Header>
							<Table.Body>
								{productos.map(producto =>
									!producto.stock ? null : (
										<Table.Row key={producto._id}>
											<Table.Cell>
												<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
													<Avatar squared src={`https://drive.google.com/uc?id=${producto.picture}&export=download`} />
													<Text css={{ paddingLeft: '1rem' }}>{producto.name}</Text>
												</div>
											</Table.Cell>
											<Table.Cell>
												<div style={{ display: 'flex' }}>
													<Button
														rounded
														color="error"
														auto
														size="xs"
														onPress={() => {
															handleLessProduct(producto._id.toString(), cantidadPorProduct(producto._id));
														}}
													>
														-
													</Button>
													<p style={{ padding: '0 1rem' }}>{cantidadPorProduct(producto._id)}</p>
													<Button
														rounded
														color="success"
														auto
														size="xs"
														onPress={() => {
															handleMoreProduct(producto._id.toString(), cantidadPorProduct(producto._id));
														}}
													>
														+
													</Button>
												</div>
											</Table.Cell>
											<Table.Cell>
												${' '}
												{calculateFinalPrice({
													price: producto.price,
													modificadoresSeleted: findModificadores(producto.modificadoresIds)
												})}
											</Table.Cell>
										</Table.Row>
									)
								)}
							</Table.Body>
						</Table>
					</div>
					<Text>Total a pagar: $ {order.total}</Text>
					<Radio.Group label="Forma de pago" value={paymentType} onChange={setPaymentType}>
						<Radio value="debito">Debito</Radio>
						<Radio value="efectivo">Efectivo</Radio>
						<Radio value="trasferencia">Trasferencia</Radio>
						<Radio value="otro">Otro</Radio>
					</Radio.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button auto flat color="error" onPress={() => setVisible(false)}>
						Cancelar
					</Button>
					<Button auto color="success" onPress={() => controlOrder(order)}>
						Crear
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ModalAgregarCompra;
