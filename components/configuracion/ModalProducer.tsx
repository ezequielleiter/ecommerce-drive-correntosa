import { Badge, Button, Grid, Input, Modal, Text } from '@nextui-org/react';
import React from 'react';
import MultiSelect from '../ui/MultiSelect';
import { CancelIcon } from '../svg/CancelIcon';
import { IconButton } from '../IconButton';

export const ModalProducer = ({
	visible,
	closeHandler,
	form,
	errors,
	handleChangeField,
	selectedTags,
	tags,
	setSelectedTags,
	validate,
	onSave,
	productorSelected
}) => {
	const tagsSelected = Array.from(selectedTags);

	const tagSelected = (tagId, tags, property) => {
		const tag = tags.find(t => t._id === tagId);
		if (property) {
			return tag ? tag[property] : '';
		}
		return tag ? tag.name : '';
	};

	const tagDeleted = (tagId, tags, setSelectedTags) => {
		const tagIndexToDelet = tags.findIndex(tag => tag === tagId);
		if (tagIndexToDelet !== -1) {
			tags.splice(tagIndexToDelet, 1);
			setSelectedTags(tags);
		}
	};

	return (
		<Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
			<Modal.Header>
				<Text id="modal-title" size={18} h4>
					Agregar productor
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Input
					placeholder="Nombre"
					value={productorSelected ? productorSelected.name : form.name}
					onChange={e => handleChangeField(e, 'name')}
				/>
				<Text color="error">{errors.name ?? ''}</Text>
				<Input
					placeholder="Imagen"
					value={productorSelected ? productorSelected.picture : form.picture}
					onChange={e => handleChangeField(e, 'picture')}
				/>
				<Input
					placeholder="Descripción"
					value={productorSelected ? productorSelected.description : form.description}
					onChange={e => handleChangeField(e, 'description')}
				/>
				<Text color="error">{errors.description ?? ''}</Text>
				<Input
					placeholder="Email"
					value={productorSelected ? productorSelected.contact.email : form.contact.email}
					onChange={e => handleChangeField(e, 'contact', 'email')}
				/>
				<Input
					placeholder="Telefono"
					value={productorSelected ? productorSelected.contact.telefono : form.contact.telefono}
					onChange={e => handleChangeField(e, 'contact', 'telefono')}
				/>
				<Input
					placeholder="Direccion"
					value={productorSelected ? productorSelected.contact.direccion : form.contact.direccion}
					onChange={e => handleChangeField(e, 'contact', 'direccion')}
				/>
				<Grid>
					{tagsSelected.length > 0 ? (
						<>
							{tagsSelected.map(selectedId => (
								<Badge size="md" style={{ backgroundColor: tagSelected(selectedId, tags, 'color') }}>
									{tagSelected(selectedId, tags, false)}
									<IconButton onClick={() => tagDeleted(selectedId, tagsSelected, setSelectedTags)}>
										<CancelIcon />
									</IconButton>
								</Badge>
							))}
						</>
					) : null}
				</Grid>
				<MultiSelect
					productorSeletedItems={productorSelected ? productorSelected.tags : null}
					itemsToSelect={tags}
					setSelecteItem={setSelectedTags}
					selectedItems={selectedTags}
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
							onSave(productorSelected ? productorSelected._id : null);
						}
					}}
				>
					Guardar
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
