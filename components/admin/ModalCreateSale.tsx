import { Button, Grid, Input, Modal, Text } from '@nextui-org/react';
import { FC, useState } from 'react';
import { createSaleType, errorsFormType } from '../../src/global/types';
import { Fetch } from '../../src/hooks/fetchHook';
import { useFormValidation } from '../../src/hooks/formHook';
import { formatDate, getMinCloseDate } from '../../helpers/date';
import { useSalesCtx } from '../../src/salescontext';
import { useRouter } from 'next/router';

type props = {
	setCreating(status: boolean): void;
	// setCurrentStatus(status: statusCart): void;
	// initialStatus: any;
	open: boolean;
};

const initialFormFields: createSaleType = {
	openDate: '',
	closeDate: '',
	name: '',
	deliveryDate: '',
	openDeliveryHour: '',
	closeDeliveryHour: '',
	locationName: '',
	locationUrl: ''
};
const initialFormErrors: errorsFormType = {};

const ModalCreateSale: FC<props> = ({ setCreating, open }) => {
	const sale = useSalesCtx();
	const router = useRouter();
	const form = useFormValidation<createSaleType>(initialFormFields);
	const [errors, setErrors] = useState(initialFormErrors);
	const [fetching, setFetching] = useState({ error: null, loading: false, done: false });
	const today = formatDate(new Date());
	const handleChangeField = (e, property: keyof createSaleType) => {
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
				locationUrl: form.fields.locationUrl
			},
			onSuccess: response => {
				// sale.selectSale(response);
				setFetching({ error: null, loading: false, done: true });
			},
			onError: e => setFetching({ error: 'Ocurrió un error enviando las fechas', loading: false, done: true })
		});
		setCreating(false);
		router.reload()
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
			locationUrl: 'Debe ingresar el link del lugar de entrega'
		});
		const validateIntervalDates = new Date(form.closeDate) <= new Date(form.openDate);

		if (localErrors || validateIntervalDates) {
			setErrors(localErrors ?? { openDate: 'La fecha de cierre debe ser mayor que la de apertura' });
		}

		return !localErrors;
	};
	const closeHandler = () => {
		setCreating(false);
	};

	return (
		<>
			<Modal closeButton blur aria-labelledby="modal-title" open={open} onClose={closeHandler} width="50%">
				<Modal.Header>
					<Text id="modal-title" size={18} weight="bold">
						Crear compra
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Grid.Container gap={2} justify="center">
						<Grid xs={4} css={{ flexDirection: 'column' }}>
							<Input
								fullWidth
								label="Nombre de la compra"
								value={form.name}
								onChange={e => handleChangeField(e, 'name')}
							/>
							<Text color="error">{errors.name ?? ''}</Text>
						</Grid>
						<Grid xs={4} css={{ flexDirection: 'column' }}>
							<Input
								type="datetime-local"
								label="Fecha y hora de apertura"
								min={today}
								value={form.openDate}
								onChange={e => handleChangeField(e, 'openDate')}
								fullWidth
							/>
							<Text color="error">{errors.openDate ?? ''}</Text>
						</Grid>
						<Grid xs={4} css={{ flexDirection: 'column' }}>
							<Input
								type="datetime-local"
								label="Fecha y hora de cierre"
								disabled={form.openDate === ''}
								min={getMinCloseDate(form.openDate)}
								value={form.closeDate}
								onChange={e => handleChangeField(e, 'closeDate')}
								fullWidth
							/>
							<Text color="error">{errors.closeDate ?? ''}</Text>
						</Grid>
					</Grid.Container>
					<Modal.Header>
						<Text weight="bold">Dia y hora de entrega</Text>
					</Modal.Header>
					<Grid.Container gap={2} justify="center">
						<Grid xs={4} css={{ flexDirection: 'column' }}>
							<Input
								type="date"
								label="Fecha de entrega"
								min={getMinCloseDate(form.closeDate)}
								value={form.deliveryDate}
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
								value={form.openDeliveryHour}
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
								value={form.closeDeliveryHour}
								onChange={e => handleChangeField(e, 'closeDeliveryHour')}
								fullWidth
							/>
							<Text color="error">{errors.closeDeliveryHour ?? ''}</Text>
						</Grid>
					</Grid.Container>
					<Modal.Header>
						<Text weight="bold">Lugar de entrega</Text>
					</Modal.Header>
					<Grid.Container gap={2} justify="center">
						<Grid xs={6} css={{ flexDirection: 'column' }}>
							<Input
								label="Nombre del lugar de entrega"
								value={form.locationName}
								onChange={e => handleChangeField(e, 'locationName')}
								fullWidth
							/>
							<Text color="error">{errors.locationName ?? ''}</Text>
						</Grid>
						<Grid xs={6} css={{ flexDirection: 'column' }}>
							<Input
								label="Lugar de la compra (link de Google Maps)"
								value={form.locationUrl}
								onChange={e => handleChangeField(e, 'locationUrl')}
								fullWidth
							/>
							<Text color="error">{errors.locationUrl ?? ''}</Text>
						</Grid>
					</Grid.Container>
				</Modal.Body>
				<Modal.Footer>
					<Button
						auto
						onClick={() => validate() && submitDates()}
						className={fetching.loading ? 'button-total-disabled' : 'button-total'}
					>
						Crear
					</Button>
					<Button
						auto
						flat
						color="error"
						onClick={() => setCreating(false)}
						className={fetching.loading ? 'button-total-disabled' : 'button-cancel'}
					>
						Cancelar
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ModalCreateSale;
