import { Button, Modal, Text } from '@nextui-org/react';
import React, { useState } from 'react';

const CargaMasivaModal = ({ visible, closeHandler }) => {
	const [file, setFile] = useState(null);
	const [isDisable, setIsDisable] = useState(true);

	const onLoadFile = e => {
		try {
			const fileToUpdate = e.target.files[0];
			setFile(fileToUpdate);
			setIsDisable(false);
		} catch (error) {
			console.error('Error al cargar el archivo:', error);
		}
	};

	const onUploadFile = () => {
		fetch('/api/products/bulkupload-products', {
			method: 'POST',
			body: file
		})
			.then(response => {
				if (response.ok) {
					console.log('Archivo cargado exitosamente');
				} else {
					console.error('Error al cargar el archivo:', response.statusText);
				}
			})
			.catch(error => {
				console.error('Error al cargar el archivo:', error);
			});
	};

	return (
		<Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
			<Modal.Header>
				<Text id="modal-title" size={18}>
					Cargar el archivo
				</Text>
			</Modal.Header>
			<Modal.Body>
				<input type="file" onChange={onLoadFile} accept=".csv" />
				{/* <Input type='file' fullWidth color="primary" size="lg" placeholder="Email" onChange={onLoadFile}/> */}
			</Modal.Body>
			<Modal.Footer>
				<Button auto flat color="error" onPress={closeHandler}>
					Cerrar
				</Button>
				<Button auto onPress={onUploadFile} disabled={isDisable}>
					Subir
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CargaMasivaModal;
