import { Button, Container, Dropdown, Input, Modal, Switch, Table, Text } from '@nextui-org/react';
import Header from '../../components/navigation/Header';
import Layout from '../layout';
import { useEffect, useMemo, useState } from 'react';
import { Fetch } from '../../src/hooks/fetchHook';
import { useFormValidation } from '../../src/hooks/formHook';
import { createAgregadoType, errorAgregadoType } from '../../src/global/types';
import { IconButton } from '../../components/IconButton';
import { EditIcon } from '../../components/svg/EditIcon';
export { getServerSideProps } from '../../src/ssp/cart';

const initialFormFields: createAgregadoType = {
	name: '',
	value: '',
	type: '',
	discount: false,
	margen: false
};

const initialFormErrors: errorAgregadoType = {};

export default function ValoresAgregados(props) {
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [modificadores, setModificadores] = useState([]);
	const [errors, setErrors] = useState(initialFormErrors);
	const [selected, setSelected] = useState('');
	const [modificadorIdToEdit, setModificadorIdToEdit] = useState(false);
	const selectedType = e => {
		setSelected(e.currentKey);
		handleChangeField(e.currentKey, 'type');
	};
	const form = useFormValidation<createAgregadoType>(initialFormFields);

	const handleChangeField = (e, property) => {
		const value = e.target ? e.target.value : e;
		form.setValue(property, value);
	};
	const closeHandler = () => {
		setVisible(false);
	};

	const tipoValorAgregado = [
		{
			type: '%',
			name: 'Porcentual'
		},
		{
			type: '+',
			name: 'Nominal'
		}
	];

	useEffect(() => {
		Fetch({
			url: `/api/modificadores`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar tags`, e);
			},
			onSuccess: res => {
				setLoading(false);
				setModificadores(res);
			}
		});
	}, [modificadores]);

	const onSave = () => {
		if (!form.discount) {
			form.setValue('discount', false);
		}
		if (!form.margen) {
			form.setValue('margen', false);
		}
		const query = modificadorIdToEdit ? { modificadorIdToEdit } : '';
		Fetch({
			url: `/api/modificadores`,
			method: modificadorIdToEdit ? 'PUT' : 'POST',
			data: { ...form.fields },
			query,
			onError: e => {
				console.warn(`error on saving order`, e);
			},
			onSuccess: e => {
				closeHandler();
			}
		});
	};

	const validate = () => {
		let localErrors: errorAgregadoType = form.validateFields({
			name: 'Debe ingresar un nombre',
			value: 'Debe ingresar un valor',
			type: 'Debe ingresar un tipo de valor agregado',
			discount: false,
			margen: false
		});
		if (localErrors) {
			setErrors(localErrors);
		}
		return !localErrors;
	};

	const onEdit = modificadorId => {
		const modificador = modificadores.find(m => m._id.toString() === modificadorId);
		if (modificador) {
			setModificadorIdToEdit(modificadorId);
			form.setValue(null, modificador);
			setSelected(form.fields.type);
			setVisible(true);
			return;
		}
		return console.error('Hubo un problema al editar un productor');
	};
	return (
		<Layout {...props}>
			<Header user={props.user} title={'Modificadores de precio'} />
			<Container>
				<Button onPress={() => setVisible(true)}> Agregar modificador </Button>
				{loading ? null : (
					<Table
						aria-label="Example table with static content"
						css={{
							height: 'auto',
							minWidth: '100%'
						}}
					>
						<Table.Header>
							<Table.Column>Nombre</Table.Column>
							<Table.Column>Valor</Table.Column>
							<Table.Column>Es descuento</Table.Column>
							<Table.Column>Es margen</Table.Column>
							<Table.Column>Acciones</Table.Column>
						</Table.Header>
						<Table.Body>
							{modificadores.map(agregado => (
								<Table.Row key={agregado._id}>
									<Table.Cell>{agregado.name}</Table.Cell>
									<Table.Cell>{agregado.value}{agregado.type}</Table.Cell>
									<Table.Cell>{agregado.discount ? "Sí" : "No"}</Table.Cell>
									<Table.Cell>{agregado.margen ? "Sí" : "No"}</Table.Cell>
									<Table.Cell>
										<IconButton onClick={() => onEdit(agregado._id)}>
											<EditIcon />
										</IconButton>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
			</Container>
			<Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
				<Modal.Header>
					<Text id="modal-title" size={18} h4>
						Agregar modificador
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Input placeholder="Nombre" value={form.name} onChange={e => handleChangeField(e, 'name')} />
					<Text color="error">{errors.name ?? ''}</Text>
					<Input placeholder="Valor" type="number" value={form.value} onChange={e => handleChangeField(e, 'value')} />
					<Text color="error">{errors.value ?? ''}</Text>
					<Dropdown>
						<Dropdown.Button flat>{selected === '' ? 'Tipo de valor agregado' : selected}</Dropdown.Button>
						<Dropdown.Menu
							aria-label="Single selection actions"
							color="secondary"
							disallowEmptySelection
							selectionMode="single"
							selectedKeys={selected}
							onSelectionChange={e => selectedType(e)}
						>
							{tipoValorAgregado.map(type => (
								<Dropdown.Item key={type.type}>{type.name}</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
					<Text color="error">{errors.type ?? ''}</Text>
					<Text style={{ marginBottom: 0 }}>Es un descuento:</Text>
					<Switch
						checked={form.discount}
						iconOn={'Sí'}
						iconOff={'No'}
						onChange={e => {
							handleChangeField(e.target.checked, 'discount');
						}}
					/>
					<Text style={{ marginBottom: 0 }}>Es un margen:</Text>
					<Switch
						checked={form.margen}
						iconOn={'Sí'}
						iconOff={'No'}
						onChange={e => {
							handleChangeField(e.target.checked, 'margen');
						}}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button auto flat color="error" onPress={closeHandler}>
						Close
					</Button>
					<Button
						auto
						onClick={() => {
							if (validate()) {
								onSave();
							}
						}}
					>
						Guardar
					</Button>
				</Modal.Footer>
			</Modal>
		</Layout>
	);
}
