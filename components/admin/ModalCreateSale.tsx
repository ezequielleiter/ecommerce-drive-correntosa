import { Button, Checkbox, Container, Grid, Input, Loading, Modal, Row, Text } from '@nextui-org/react';
import { FC, useState } from 'react';
import { createSaleType, errorsFormType, statusCart } from '../../src/global/types';
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

const initialFormFields: createSaleType = { openDate: '', closeDate: '', name: '' };
const initialFormErrors: errorsFormType = {};

const ModalCreateSale: FC<props> = ({ setCreating, setCurrentStatus, initialStatus, open }) => {
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
				name: form.fields.name
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
			name: 'Debe ingresar un nombre'
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
		<Modal closeButton blur aria-labelledby="modal-title" open={open} onClose={closeHandler}>
			<Modal.Header>
				<Text id="modal-title" size={18}>
					Crear compra
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Input label="Nombre de la compra" value={form.name} onChange={e => handleChangeField(e, 'name')} />
				<Text color="error">{errors.name ?? ''}</Text>
				<Input
					type="datetime-local"
					label="Fecha y hora de apertura"
					min={today}
					value={form.openDate}
					onChange={e => handleChangeField(e, 'openDate')}
				/>
				<Text color="error">{errors.openDate ?? ''}</Text>
				<Input
					type="datetime-local"
					label="Fecha y hora de cierre"
					disabled={form.openDate === ''}
					min={getMinCloseDate(form.openDate)}
					value={form.closeDate}
					onChange={e => handleChangeField(e, 'closeDate')}
				/>
				<Text color="error">{errors.closeDate ?? ''}</Text>
			</Modal.Body>
			<Modal.Footer>
				<Button
					auto
					flat
					color="error"
					onClick={() => setCreating(false)}
					className={fetching.loading ? 'button-total-disabled' : 'button-cancel'}
				>
					Cancelar
				</Button>
				<Button
					auto
					onClick={() => validate() && submitDates()}
					className={fetching.loading ? 'button-total-disabled' : 'button-total'}
				>
					Crear
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalCreateSale;
