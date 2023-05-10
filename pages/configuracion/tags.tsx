import { Button, Container, Input, Modal, Table, Text } from '@nextui-org/react';
import Header from '../../components/navigation/Header';
import Layout from '../layout';
import { useEffect, useState } from 'react';
import { Fetch } from '../../src/hooks/fetchHook';
import { useFormValidation } from '../../src/hooks/formHook';
import { createTagType, errorTagType } from '../../src/global/types';
import { EyeIcon } from '../../components/svg/EyeIcon';
import { IconButton } from '../../components/IconButton';
import { EditIcon } from '../../components/svg/EditIcon';
import { ModalTags } from '../../components/configuracion/ModalTags';
export { getServerSideProps } from '../../src/ssp/cart';

const initialFormFields: createTagType = {
	name: '',
	description: '',
	color: ''
};

const initialFormErrors: errorTagType = {};

export default function Tags(props) {
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [tags, setTags] = useState([]);
	const [tagIdToEdit, setTagIdToEdit] = useState(false);
	const [errors, setErrors] = useState(initialFormErrors);
	const handler = () => setVisible(true);
	const form = useFormValidation<createTagType>(initialFormFields);
	
	const handleChangeField = (e, property) => {
		const value = e.target.value;
		form.setValue(property, value);
	};
	const closeHandler = () => {
		setTagIdToEdit(false)
		setVisible(false);
	};

	useEffect(() => {
		Fetch({
			url: `/api/tag`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar tags`, e);
			},
			onSuccess: res => {
				setLoading(false);
				setTags(res);
			}
		});
	}, []);

	const onSave = () => {
		const query = tagIdToEdit ? {tagIdToEdit} : ''
		Fetch({
			url: `/api/tag`,
			method: tagIdToEdit ? 'PUT': 'POST',
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
		let localErrors: errorTagType = form.validateFields({
			name: 'Debe ingresar un nombre',
			description: 'Debe ingresar una descripcion',
			color: 'Debe ingresar un color'
		});
		console.log(localErrors);
		
		if (localErrors) {
			setErrors(localErrors);
		}
		return !localErrors;
	};

	const onEdit = tagId => {
		const tag = tags.find(t => t._id.toString() === tagId);
		if (tag) {
			form.setValue(null, tag);
			setTagIdToEdit(tagId)
			setVisible(true);
			return;
		}
		return console.error('Hubo un problema al editar un productor');
	};
	return (
		<Layout {...props}>
			<Header user={props.user} title={'Tags'} />
			<Container>
				<Button onPress={() => setVisible(true)}> Agregar tag</Button>
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
							<Table.Column>Acciones</Table.Column>
						</Table.Header>
						<Table.Body>
							{tags.map(tag => (
								<Table.Row key={tag._id}>
									<Table.Cell>{tag.name}</Table.Cell>
									<Table.Cell>
										<IconButton onClick={() => onEdit(tag._id)}>
											<EditIcon />
										</IconButton>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
			</Container>
			<ModalTags
				visible={visible}
				closeHandler={closeHandler}
				form={form}
				errors={errors}
				handleChangeField={handleChangeField}
				validate={validate}
				onSave={onSave}
			/>
		</Layout>
	);
}
