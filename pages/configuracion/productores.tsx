import { Badge, Button, Container, Grid, Table } from '@nextui-org/react';
import Header from '../../components/navigation/Header';
import Layout from '../layout';
import { useEffect, useState } from 'react';
import { Fetch } from '../../src/hooks/fetchHook';
import { useFormValidation } from '../../src/hooks/formHook';
import { createProductorType, errorProductorType } from '../../src/global/types';
import { IconButton } from '../../components/IconButton';
import { ModalProducer } from '../../components/configuracion/ModalProducer';
import { EditIcon } from '../../components/svg/EditIcon';
export { getServerSideProps } from '../../src/ssp/cart';

const initialFormFields: createProductorType = {
	name: '',
	picture: '',
	tags: [],
	description: '',
	contact: {
		email: '',
		telefono: '',
		direccion: ''
	}
};

const initialFormErrors: errorProductorType = {};

export default function Productos(props) {
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [productores, setProductores] = useState([]);

	const [tags, setTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);
	const [errors, setErrors] = useState(initialFormErrors);

	const [productorSelected, setProductorSelected] = useState();

	const form = useFormValidation<createProductorType>(initialFormFields);
	const handleChangeField = (e, property, type = '') => {
		const value = e.target.value;
		if (property === 'contact') {
			form.contact[type] = value;
			return;
		}
		form.setValue(property, value);
	};

	const closeHandler = () => {
		form.setValue(null, initialFormFields);
		setProductorSelected(null);
		setSelectedTags([])
		setVisible(false);
	};

	useEffect(() => {
		const productor = Fetch({
			url: `/api/productor`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar productores`, e);
			},
			onSuccess: res => {
				setLoading(false);
				setProductores(res);
			}
		});
		const tags = Fetch({
			url: `/api/tag`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar productores`, e);
			},
			onSuccess: res => {
				setLoading(false);
				setTags(res);
			}
		});
		Promise.all([productor, tags]);
	}, [productores]);

	const onSave = productorId => {
		const tagsToSave = Array.from(selectedTags);
		if (tagsToSave.length > 0) {
			form.fields.tags = tagsToSave;
		}
		const query = productorId ? { productorId } : null;
		Fetch({
			url: `/api/productor`,
			method: productorId ? 'PUT' : 'POST',
			data: { ...form.fields },
			query,
			onError: e => {
				console.warn(`error al guardar un productor`, e);
			},
			onSuccess: e => {
				closeHandler();
			}
		});
	};

	const validate = () => {
		let localErrors: errorProductorType = form.validateFields({
			name: 'Debe ingresar un nombre',
			description: 'Debe ingresar una descripcion'
		});
		if (localErrors) {
			setErrors(localErrors);
		}
		return !localErrors;
	};

	const tagSelected = (tagId, tags, property) => {
		const tag = tags.find(t => t._id === tagId);
		if (property) {
			return tag ? tag[property] : '';
		}
		return tag ? tag.name : '';
	};

	const onEdit = productorId => {
		const productor = productores.find(p => p._id.toString() === productorId);
		if (productor) {
			setProductorSelected(productor);
			form.setValue(null, productor);
			setSelectedTags(productor.tags);
			setVisible(true);
			return;
		}
		return console.error('Hubo un problema al editar un productor');
	};

	return (
		<Layout {...props}>
			<Header user={props.user} title={'Productores'} />
			<Container>
				<Button onPress={() => setVisible(true)}> Agregar productor </Button>
				{loading ? null : (
					<Table
						sticked
						aria-label="Example table with static content"
						css={{
							height: 'auto',
							minWidth: '100%'
						}}
					>
						<Table.Header>
							<Table.Column>Nombre</Table.Column>
							<Table.Column>Tags</Table.Column>
							<Table.Column>Acciones</Table.Column>
						</Table.Header>
						<Table.Body>
							{productores.map(productor => (
								<Table.Row key={productor._id}>
									<Table.Cell>{productor.name}</Table.Cell>
									<Table.Cell>
										<Grid>
											{productor.tags.length > 0 ? (
												<>
													{productor.tags.map(tagId => (
														<Badge size="md" style={{ backgroundColor: tagSelected(tagId, tags, 'color') }}>
															{tagSelected(tagId, tags, false)}
														</Badge>
													))}
												</>
											) : null}
										</Grid>
									</Table.Cell>
									<Table.Cell>
										<IconButton onClick={() => onEdit(productor._id)}>
											<EditIcon />
										</IconButton>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
			</Container>
			<ModalProducer
				visible={visible}
				closeHandler={closeHandler}
				form={form}
				errors={errors}
				handleChangeField={handleChangeField}
				selectedTags={selectedTags}
				tags={tags}
				setSelectedTags={setSelectedTags}
				validate={validate}
				onSave={onSave}
				productorSelected={productorSelected}
			/>
		</Layout>
	);
}
