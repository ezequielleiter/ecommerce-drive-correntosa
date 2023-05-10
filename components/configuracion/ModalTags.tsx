import { Badge, Button, Grid, Input, Modal, Text } from '@nextui-org/react';
import React from 'react';
import MultiSelect from '../ui/MultiSelect';
import { CancelIcon } from '../svg/CancelIcon';
import { IconButton } from '../IconButton';

export const ModalTags = ({
	visible,
	closeHandler,
	form,
	errors,
	handleChangeField,
	validate,
	onSave,
}) => {

	return (
		<Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
			<Modal.Header>
				<Text id="modal-title" size={18} h4>
					Agregar tag
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Input placeholder="Nombre" value={form.name} onChange={e => handleChangeField(e, 'name')} />
				<Text color="error">{errors.name ?? ''}</Text>
				<Input placeholder="Descripción" value={form.description} onChange={e => handleChangeField(e, 'description')} />
				<Text color="error">{errors.description ?? ''}</Text>
				<Input placeholder="Color" value={form.color} onChange={e => handleChangeField(e, 'color')} type="color" />
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
	);
};
