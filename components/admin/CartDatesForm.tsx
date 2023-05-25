import { Avatar, Button, Container, Grid, Input, Loading, Table, Text } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { datesFormType, errorsFormType, statusCart } from '../../src/global/types';
import { Fetch } from '../../src/hooks/fetchHook';
import { useFormValidation } from '../../src/hooks/formHook';
import { formatDate, getMinCloseDate } from '../../helpers/date';
import { useSalesCtx } from '../../src/salescontext';
import calculateFinalPrice from '../../src/helpers/prices/calculateFinalPrice';

type props = {
	setEditing(status: boolean): void;
	setCurrentStatus(status: statusCart): void;
	initialStatus: any;
	productos: any;
	modificadores: any;
};

const initialFormFields: datesFormType = {
	openDate: '',
	closeDate: '',
	name: '',
	deliveryDate: '',
	openDeliveryHour: '',
	closeDeliveryHour: '',
	locationName: '',
	locationUrl: '',
	productsIds: ''
};
const initialFormErrors: errorsFormType = {};

const CartDatesForm: FC<props> = ({ setEditing, setCurrentStatus, initialStatus, productos, modificadores }) => {
	const sale = useSalesCtx();
	const form = useFormValidation<datesFormType>(initialFormFields);
	const [errors, setErrors] = useState(initialFormErrors);
	const [fetching, setFetching] = useState({ error: null, loading: false, done: false });
	const [productsIds, setProductsIds] = useState([]);
	const today = formatDate(new Date());
	const handleChangeField = (e, property: keyof datesFormType) => {
		const value = e.target.value;
		form.setValue(property, value);
	};

	const submitDates = () => {
		setFetching({ error: null, done: false, loading: true });
		Fetch<datesFormType>({
			url: '/api/admin/cart/dates',
			method: 'PUT',
			data: {
				...form.fields,
				openDate: form.fields.openDate.replace('.000Z', ''),
				closeDate: form.fields.closeDate.replace('.000Z', ''),
				name: form.fields.name,
				id: initialStatus._id,
				deliveryDate: form.fields.deliveryDate,
				openDeliveryHour: form.fields.openDeliveryHour,
				closeDeliveryHour: form.fields.closeDeliveryHour,
				locationName: form.fields.locationName,
				locationUrl: form.fields.locationUrl,
				productsIds
			},
			onSuccess: response => {
				sale.selectSale(response);
				setFetching({ error: null, loading: false, done: true });
			},
			onError: e => setFetching({ error: 'Ocurrió un error enviando las fechas', loading: false, done: true })
		});
		setEditing(false);
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
			productsIds: 'Debe ingresar al menos un producto'
		});
		const validateIntervalDates = new Date(form.closeDate) <= new Date(form.openDate);

		if (localErrors || validateIntervalDates) {
			setErrors(localErrors ?? { openDate: 'La fecha de cierre debe ser mayor que la de apertura' });
		}

		return !localErrors;
	};

	useEffect(() => {
		form.setValue(null, initialStatus);
		setProductsIds(initialStatus.productsIds);
	}, []);

	const handleSelectionChange = e => {
		if (e === 'all') {
			const allProductsIdToAdd = productos.map(p => p._id.toString());
			setProductsIds(allProductsIdToAdd);
		} else {
			const productsIdToAdd = Array.from(e);
			setProductsIds(productsIdToAdd);
		}
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

	return (
		<Container>
			<Grid.Container gap={2} justify="center" css={{ width: '60vw' }}>
				<Grid>
					<Input label="Nombre de la compra" value={initialStatus.name} onChange={e => handleChangeField(e, 'name')} />
					<Text color="error">{errors.name ?? ''}</Text>
				</Grid>
			</Grid.Container>
			<Grid.Container gap={3} justify="center">
				<Grid>
					<Input
						type="datetime-local"
						label="Fecha y hora de apertura"
						min={today}
						value={initialStatus.openDate}
						onChange={e => handleChangeField(e, 'openDate')}
					/>
					<Text color="error">{errors.openDate ?? ''}</Text>
				</Grid>
				<Grid>
					<Input
						type="datetime-local"
						label="Fecha y hora de cierre"
						disabled={form.openDate === ''}
						min={getMinCloseDate(form.openDate)}
						value={initialStatus.closeDate}
						onChange={e => handleChangeField(e, 'closeDate')}
					/>
					<Text color="error">{errors.closeDate ?? ''}</Text>
				</Grid>
			</Grid.Container>
			<Text weight="bold" css={{ textAlign: 'center' }}>
				Dia y hora de entrega
			</Text>
			<Grid.Container gap={2} justify="center">
				<Grid xs={4} css={{ flexDirection: 'column' }}>
					<Input
						type="date"
						label="Fecha de entrega"
						min={getMinCloseDate(form.closeDate)}
						value={initialStatus.deliveryDate}
						onChange={e => handleChangeField(e, 'deliveryDate')}
						fullWidth
					/>
					<Text color="error">{errors.deliveryDate ?? ''}</Text>
				</Grid>
				<Grid xs={4} css={{ flexDirection: 'column' }}>
					<Input
						type="time"
						label="Desde:"
						// min={getMinCloseDate(form.openDate)}
						value={initialStatus.openDeliveryHour}
						onChange={e => handleChangeField(e, 'openDeliveryHour')}
						fullWidth
					/>
					<Text color="error">{errors.openDeliveryHour ?? ''}</Text>
				</Grid>
				<Grid xs={4} css={{ flexDirection: 'column' }}>
					<Input
						type="time"
						label="Hasta:"
						// min={getMinCloseDate(form.openDate)}
						value={initialStatus.closeDeliveryHour}
						onChange={e => handleChangeField(e, 'closeDeliveryHour')}
						fullWidth
					/>
					<Text color="error">{errors.closeDeliveryHour ?? ''}</Text>
				</Grid>
			</Grid.Container>
			<Text weight="bold" css={{ textAlign: 'center' }}>
				Lugar de entrega
			</Text>
			<Grid.Container gap={2} justify="center">
				<Grid xs={6} css={{ flexDirection: 'column' }}>
					<Input
						label="Nombre del lugar de entrega"
						value={initialStatus.locationName}
						onChange={e => handleChangeField(e, 'locationName')}
						fullWidth
					/>
					<Text color="error">{errors.locationName ?? ''}</Text>
				</Grid>
				<Grid xs={6} css={{ flexDirection: 'column' }}>
					<Input
						label="Lugar de la compra (link de Google Maps)"
						value={initialStatus.locationUrl}
						onChange={e => handleChangeField(e, 'locationUrl')}
						fullWidth
					/>
					<Text color="error">{errors.locationUrl ?? ''}</Text>
				</Grid>
			</Grid.Container>
			<Table
				aria-label="Example table with static content"
				css={{
					height: 'auto',
					minWidth: '100%'
				}}
				compact
				selectionMode="multiple"
				lined
				headerLined
				shadow={false}
				sticked
				onSelectionChange={handleSelectionChange}
				selectedKeys={productsIds}
			>
				<Table.Header>
					<Table.Column>Nombre</Table.Column>
					<Table.Column>Precio neto</Table.Column>
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
								<Table.Cell>$ {producto.price}</Table.Cell>
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
			<Button
				onClick={() => setEditing(false)}
				className={fetching.loading ? 'button-total-disabled' : 'button-cancel'}
			>
				Cancelar
			</Button>
			<Button
				onClick={() => validate() && submitDates()}
				className={fetching.loading ? 'button-total-disabled' : 'button-total'}
			>
				Confirmar
			</Button>
			<Grid.Container gap={2} direction="column" justify="center">
				{fetching.loading && <Loading color="warning"></Loading>}
				{fetching.done && fetching.error && <Text>{fetching.error}</Text>}
			</Grid.Container>
		</Container>
	);
};

export default CartDatesForm;
