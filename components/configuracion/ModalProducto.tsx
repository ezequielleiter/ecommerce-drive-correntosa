import { Badge, Button, Checkbox, Divider, Grid, Input, Modal, Text } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { IconButton } from '../../components/IconButton';
import { CancelIcon } from '../../components/svg/CancelIcon';
import SelectComponent from '../../components/ui/SelectElement';
import MultiSelect from '../../components/ui/MultiSelect';
import calculateFinalPrice from '../../src/helpers/prices/calculateFinalPrice';
import Image from 'next/image';

export default function ModalProductor({
	visible,
	onClickSave,
	closeHandler,
	productores,
	tags,
	modificadores,
	form,
	handleChangeField
}) {
	const [selectedOption, setSelectedOption] = useState('');
	const [selectedUnit, setSelectedUnit] = useState('');
	const [esPorTalle, setEsPorTalle] = useState(false);
	const [tieneColor, setTieneColor] = useState(false);
	const [peso, setPeso] = useState('');
	const [productor, setProductor] = useState();
	const [volumen, setVolumen] = useState('');
	const [disponible, setDisponible] = useState(false);
	const [tagsSelected, setTagsSelected] = useState([]);
	const [seletedModificadoresIds, setSeletedModificadoresIds] = useState([]);
	const [finalPrice, setFinalPrice] = useState(0);
	const [modificadoresDescriptions, setModificadoresDescriptions] = useState([]);

	const medidaOptions = ['unidades', 'peso', 'volumen'];
	const unitOptions = ['unidad', 'docena'];
	const pesoOptions = ['kg', 'gr'];
	const volumenOptions = ['l', 'ml'];

	const tagSelected = (tagId, tags, property) => {
		const tag = tags.find(t => t._id === tagId);
		if (property) {
			return tag ? tag[property] : '';
		}
		return tag ? tag.name : '';
	};

	const tagDeleted = (tagId, tags, setTagsSelected) => {
		const tagIndexToDelet = tags.findIndex(tag => tag === tagId);
		if (tagIndexToDelet !== -1) {
			tagsSelected.splice(tagIndexToDelet, 1);
			setTagsSelected(tagsSelected);
		}
	};

	const onSelectTag = e => {
		const value = Array.from(e);
		handleChangeField(value, 'tags');
		setTagsSelected(value);
	};

	const onSelectProductor = productorId => {
		handleChangeField(productorId, 'seller');
		const productor = productores.find(p => p._id === productorId);
		setProductor(productor);
	};

	const onSelectModificador = e => {
		const value = Array.from(e);
		let modificadoresSeleted = [];
		value.forEach(valueId => {
			const modificador = modificadores.find(m => m._id === valueId);
			modificadoresSeleted.push(modificador);
		});
		setSeletedModificadoresIds(value);
		handleChangeField(value, 'modificadoresIds');
		const precioFinal = calculateFinalPrice({
			price: form.fields.price,
			modificadoresSeleted
		});
		setModificadoresDescriptions(modificadoresSeleted);
		setFinalPrice(Number(precioFinal));
	};

	const selectedTitle = productor => {
		if (productor) {
			return productor.name;
		}
		return null;
	};

	const titleCantidad = () => {
		if (peso) {
			return `Cantidad en ${peso}`;
		}
		if (volumen) {
			return `Cantidad en ${volumen}`;
		}
		if (selectedUnit) {
			return `Cantidad de ${selectedUnit}`;
		}
	};

	const onSetPeso = e => {
		setPeso(e);
		handleChangeField(e, 'measurement');
	};

	const OnSetSelectedUnit = e => {
		setSelectedUnit(e);
		handleChangeField(e, 'measurement');
	};

	const OnSetVolumen = e => {
		setVolumen(e);
		handleChangeField(e, 'measurement');
	};

	function onSelectedDisponible(e) {
		handleChangeField(e, 'stock');
		setDisponible(e);
	}

	const setOpcionOnEdit = () => {
		if (['l', 'ml'].includes(form.fields.measurement)) {
			setSelectedOption('volumen');
			OnSetVolumen(form.fields.measurement);
		}
		if (['kg', 'gr'].includes(form.fields.measurement)) {
			setSelectedOption('peso');
			onSetPeso(form.fields.measurement);
		}
		if (['unidad', 'docena'].includes(form.fields.measurement)) {
			setSelectedOption('unidades');
			OnSetSelectedUnit(form.fields.measurement);
		}
		onSelectProductor(form.fields.seller);
		onSelectTag(form.fields.tags);
		onSelectModificador(form.fields.modificadoresIds);
		onSelectedDisponible(form.fields.stock);
	};

	return (
		<Modal
			fullScreen
			onOpen={() => setOpcionOnEdit()}
			closeButton
			aria-labelledby="modal-title"
			open={visible}
			onClose={closeHandler}
		>
			<Modal.Header>
				<Text id="modal-title" size={18} h4>
					Agregar producto
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Grid.Container>
					<Grid
						sm={12}
						md={4}
						style={{
							flexDirection: 'column'
						}}
					>
						<Text h5 className="left">
							Descripción
						</Text>
						<Input
							clearable
							bordered
							label="Nombre"
							width="50%"
							value={form.name}
							onChange={e => handleChangeField(e.target.value, 'name')}
						/>
						<Input
							clearable
							bordered
							value={form.description}
							label="Descripción"
							width="50%"
							css={{ paddingTop: '1rem' }}
							onChange={e => handleChangeField(e.target.value, 'description')}
						/>
						<Input
							clearable
							bordered
							value={form.picture}
							onChange={e => handleChangeField(e.target.value, 'picture')}
							label="Id de imagen de producto"
							width="50%"
							css={{ paddingTop: '1rem' }}
						/>
						{form.picture ? (
							<div style={{ marginTop: '2rem' }}>
								<Image
									width={100}
									height={100}
									src={`https://drive.google.com/uc?id=${form.picture}&export=download`}
								/>
							</div>
						) : null}
						<Input
							clearable
							bordered
							value={form.code}
							onChange={e => handleChangeField(e.target.value, 'code')}
							label="Codigo del producto"
							width="50%"
							css={{ paddingTop: '1rem' }}
						/>
					</Grid>
					<Grid
						sm={12}
						md={4}
						style={{
							flexDirection: 'column'
						}}
					>
						<Text h5 className="left">
							Caracteristicas del producto
						</Text>
						<SelectComponent
							title={'Medida'}
							onSelect={setSelectedOption}
							selectedOption={selectedOption}
							options={medidaOptions}
							selectedTitle={selectedOption}
						/>
						{selectedOption === 'peso' ? (
							<SelectComponent
								title={'Unidad de medida'}
								onSelect={onSetPeso}
								selectedOption={peso}
								options={pesoOptions}
								selectedTitle={peso}
							/>
						) : selectedOption === 'unidades' ? (
							<SelectComponent
								title={'Tipo de unidad'}
								onSelect={OnSetSelectedUnit}
								selectedOption={selectedUnit}
								options={unitOptions}
								selectedTitle={selectedUnit}
							/>
						) : selectedOption === 'volumen' ? (
							<SelectComponent
								title={'Tipo de unidad'}
								onSelect={OnSetVolumen}
								selectedOption={volumen}
								options={volumenOptions}
								selectedTitle={volumen}
							/>
						) : null}
						{selectedUnit === 'unidad' && selectedOption === 'unidades' ? (
							<>
								<Checkbox size="sm" isSelected={esPorTalle} onChange={setEsPorTalle}>
									Es por talle
								</Checkbox>
								{esPorTalle && (
									<Input
										width="20%"
										clearable
										bordered
										label="Talles"
										onChange={e => handleChangeField(e.target.value, 'sizes')}
									/>
								)}
								<Checkbox size="sm" isSelected={tieneColor} onChange={setTieneColor}>
									Tiene color
								</Checkbox>
								{tieneColor && (
									<Input
										width="20%"
										clearable
										bordered
										label="Color"
										onChange={e => handleChangeField(e.target.value, 'color')}
									/>
								)}
							</>
						) : null}
						{selectedOption && (peso || selectedUnit || volumen) ? (
							<Input
								clearable
								bordered
								value={form.weight}
								onChange={e => handleChangeField(e.target.value, 'weight')}
								label={titleCantidad()}
								width="20%"
								type="number"
							/>
						) : null}

						<SelectComponent
							title={'Productor/a'}
							onSelect={onSelectProductor}
							selectedOption={productor}
							options={productores}
							useId
							selectedTitle={selectedTitle(productor)}
						/>
						<Grid>
							{tagsSelected.length > 0 ? (
								<>
									{tagsSelected.map(selectedId => (
										<Badge size="md" style={{ backgroundColor: tagSelected(selectedId, tags, 'color') }}>
											{tagSelected(selectedId, tags, false)}
											<IconButton onClick={() => tagDeleted(selectedId, tagsSelected, setTagsSelected)}>
												<CancelIcon />
											</IconButton>
										</Badge>
									))}
								</>
							) : null}
						</Grid>
						<MultiSelect
							selectedTitle="Tags"
							itemsToSelect={tags}
							setSelecteItem={onSelectTag}
							selectedItems={tagsSelected}
						/>
						<Checkbox
							css={{ paddingTop: '1rem' }}
							size="sm"
							isSelected={disponible}
							onChange={e => onSelectedDisponible(e)}
						>
							Hay disponible
						</Checkbox>
					</Grid>
					<Grid
						sm={12}
						md={4}
						style={{
							flexDirection: 'column'
						}}
					>
						<Text h5 className="left">
							Precio del producto
						</Text>
						<div style={{ flexDirection: 'row', display: 'flex' }}>
							<Input
								clearable
								bordered
								label="Precio neto"
								width="20%"
								type="number"
								value={form.price}
								onChange={e => handleChangeField(Number(e.target.value), 'price')}
							/>
							<div style={{ marginLeft: 20, paddingTop: 10 }}>
								<MultiSelect
									selectedTitle="Modificadores"
									setSelecteItem={onSelectModificador}
									selectedItems={seletedModificadoresIds}
									itemsToSelect={modificadores}
								/>
							</div>
						</div>
						{modificadoresDescriptions.length > 0 ? (
							<div>
								<Divider css={{ margin: '1rem 0rem', width: '50%' }} />
								{modificadoresDescriptions.map(m => (
									<div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
										<Badge variant="dot" />
										<Text css={{ paddingLeft: 5 }} key={m._id}>
											{m.name}{' '}
										</Text>
									</div>
								))}
								<Divider css={{ margin: '1rem 0rem', width: '50%' }} />
							</div>
						) : null}
						<div>
							<Text>Precio final: </Text>
							<Text css={{ fontSize: 30, fontWeight: 'bold' }}>${finalPrice}</Text>
						</div>
					</Grid>
				</Grid.Container>
			</Modal.Body>
			<Modal.Footer>
				<Button auto flat color="error" onPress={closeHandler}>
					Cerrar
				</Button>
				<Button auto onPress={onClickSave}>
					Guardar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
