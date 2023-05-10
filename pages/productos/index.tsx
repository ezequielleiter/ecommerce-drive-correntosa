import { Button, Checkbox, Divider, Input, Modal, Row, Text } from '@nextui-org/react';
import Header from '../../components/navigation/Header';
import Layout from '../layout';
import { useState } from 'react';
import SelectComponent from '../../components/ui/SelectElement';
import { useFormValidation } from '../../src/hooks/formHook';
import { ProductModel } from '../../src/global/types';
export { getServerSideProps } from '../../src/ssp/cart';
import { Fetch } from '../../src/hooks/fetchHook';

const initialFormFields: ProductModel = {
	stock: false,
	name: '',
	price: 0,
	seller: '',
	picture: '',
	tags: [],
	sizes: [],
	color: [],
	description: '',
	addedRecharge: [],
	measurement: [],
	weight: null
};

export default function Productos(props) {
	const [visible, setVisible] = useState(false);
	const handler = () => setVisible(true);
	const [selectedOption, setSelectedOption] = useState('');
	const [selectedUnit, setSelectedUnit] = useState('');
	const [esPorTalle, setEsPorTalle] = useState(false);
	const [tieneColor, setTieneColor] = useState(false);
	const [peso, setPeso] = useState('');
	const [productor, setProductor] = useState('');
	const [volumen, setVolumen] = useState('');
	const [disponible, setDisponible] = useState(false);
	const [valoresAgregados, setvaloresAgregados] = useState([]);

	const [tags, setTags] = useState([]);
	const closeHandler = () => {
		setVisible(false);
	};

	const medidaOptions = ['unidades', 'peso', 'volumen'];
	const unitOptions = ['unidad', 'docena'];
	const pesoOptions = ['kg', 'gr'];
	const volumenOptions = ['l', 'ml'];
	const productorOptions = ['productor A', 'productor B'];
	const tagsOptions = ['vegano', 'almacen', 'indumentaria'];
	const valoresAgregadosOptions = ['Envio 5%', 'Correntosa 10%'];

	const form = useFormValidation<ProductModel>(initialFormFields);

	const onClickSave = () => {
		const query = {
			stock: false,
			name: "test",
			price: 20,
			seller: "productor A",
			picture: "unlink",
			tags: [
				"vegano",
				"sin tacc"
			],
			sizes: [],
			color: [],
			description: "una descripcion",
			addedRecharge: [
				{
					name: "Envio",
					type: "%",
					recharge: 5,
					_id: "unId"
				}
			],
			cost: 10,
			addedValues: [],
			measurement: "unidad"
		};
		Fetch({
			url: '/api/products/save-product',
			method: 'POST',
			data: query
		});
	};


	return (
		<Layout {...props}>
			<Header user={props.user} title={'Productos'} />
			<Button onPress={() => setVisible(true)}> + </Button>
			<Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
				<Modal.Header>
					<Text id="modal-title" size={18} h4>
						Agregar producto
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Input clearable bordered labelPlaceholder="Nombre" />
					<Input clearable bordered labelPlaceholder="Descripción" />
					<Input clearable bordered labelPlaceholder="Link de imagen de producto" />
					<SelectComponent
						title={'Medida'}
						onSelect={setSelectedOption}
						selectedOption={selectedOption}
						options={medidaOptions}
					/>
					{selectedOption === 'peso' ? (
						<SelectComponent
							title={'Unidad de medida'}
							onSelect={setPeso}
							selectedOption={peso}
							options={pesoOptions}
						/>
					) : selectedOption === 'unidades' ? (
						<SelectComponent
							title={'Tipo de unidad'}
							onSelect={setSelectedUnit}
							selectedOption={selectedUnit}
							options={unitOptions}
						/>
					) : selectedOption === 'volumen' ? (
						<SelectComponent
							title={'Tipo de unidad'}
							onSelect={setVolumen}
							selectedOption={volumen}
							options={volumenOptions}
						/>
					) : null}
					{selectedUnit === 'unidad' && selectedOption === 'unidades' ? (
						<>
							<Checkbox size="sm" isSelected={esPorTalle} onChange={setEsPorTalle}>
								Es por talle
							</Checkbox>
							{esPorTalle && <Input clearable bordered labelPlaceholder="Talles" />}
							<Checkbox size="sm" isSelected={tieneColor} onChange={setTieneColor}>
								Tiene color
							</Checkbox>
							{tieneColor && <Input clearable bordered labelPlaceholder="Color" />}
						</>
					) : null}
					<SelectComponent
						title={'Productor/a'}
						onSelect={setProductor}
						selectedOption={productor}
						options={productorOptions}
					/>
					<Checkbox size="sm" isSelected={disponible} onChange={setDisponible}>
						Hay disponible
					</Checkbox>
					<SelectComponent title={'Tags'} onSelect={setTags} selectedOption={tags} options={tagsOptions} multiple />
					<Divider />
					<Text h4 className="center-text">
						Precio del producto
					</Text>
					<Input clearable bordered labelPlaceholder="Precio neto" />
					<SelectComponent
						title={'Valores agregados'}
						onSelect={setvaloresAgregados}
						selectedOption={valoresAgregados}
						options={valoresAgregadosOptions}
						multiple
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button auto flat color="error" onPress={closeHandler}>
						Close
					</Button>
					<Button auto onPress={onClickSave}>
						Guardar
					</Button>
				</Modal.Footer>
			</Modal>
		</Layout>
	);
}
