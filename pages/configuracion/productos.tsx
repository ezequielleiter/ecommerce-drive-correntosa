import { Avatar, Button, Container, Grid, Table, Text } from '@nextui-org/react';
import Header from '../../components/navigation/Header';
import Layout from '../layout';
import { useEffect, useState } from 'react';
import { useFormValidation } from '../../src/hooks/formHook';
import { createProductoType } from '../../src/global/types';
export { getServerSideProps } from '../../src/ssp/cart';
import { Fetch } from '../../src/hooks/fetchHook';
import ModalProductor from '../../components/configuracion/ModalProducto';
import { IconButton } from '../../components/IconButton';
import { EditIcon } from '../../components/svg/EditIcon';
import CargaMasivaModal from '../../components/ui/CargaMasivaModal';

const initialFormFields: createProductoType = {
	name: '', //nombre,
	description: '', //descripcion del producto
	measurement: '', //va a tener la unidad de medida del producto (unidad, kg, gr, cl)
	picture: '',
	weight: '', //aca va el peso, gramo o cantidad de unidades del producto,
	sizes: [], // si tiene talles, los talles en un string por ahora
	color: [], // si tiene colores, los colores en un string por ahora
	seller: '', //aca va el Id del productor,
	tags: [],
	stock: false,
	price: 0, // precio neto del producto sin agregados
	modificadoresIds: [],
	code: ''
};

export default function Productos(props) {
	const [visible, setVisible] = useState(false);
	const [visibleCargaMasiva, setVisibleCargaMasiva] = useState(false);
	const [tags, setTags] = useState([]);
	const [productores, setProductores] = useState([]);
	const [modificadores, setModificadores] = useState([]);
	const [productos, setProductos] = useState([]);
	const [productorIdToEdit, setProductoIdToEdit] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const allProductores = Fetch({
			url: `/api/productor`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar productores`, e);
			},
			onSuccess: res => {
				setProductores(res);
			}
		});

		const allTags = Fetch({
			url: `/api/tag`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar tags`, e);
			},
			onSuccess: res => {
				setTags(res);
			}
		});

		const allModificadores = Fetch({
			url: `/api/modificadores`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar tags`, e);
			},
			onSuccess: res => {
				setModificadores(res);
			}
		});

		const allProductos = Fetch({
			url: `/api/products`,
			method: 'GET',
			onError: e => {
				console.warn(`error al buscar tags`, e);
			},
			onSuccess: res => {
				setProductos(res.products);
			}
		});

		Promise.all([allProductores, allTags, allModificadores, allProductos]).then(() => setLoading(false));
	}, [productos]);

	const closeHandler = () => {
		setVisible(false);
		setProductoIdToEdit(false);
		form.setValue(null, initialFormFields);
	};

	const closeHandlerCargaMasiva = () => {
		setVisibleCargaMasiva(false);
	};

	const form = useFormValidation<createProductoType>(initialFormFields);

	const onClickSave = () => {
		const query = productorIdToEdit ? { productorIdToEdit } : '';
		Fetch({
			url: '/api/products/save-product',
			method: productorIdToEdit ? 'PUT' : 'POST',
			data: form.fields,
			query,
			onSuccess: () => {
				setVisible(false);
			}
		});
	};

	const handleChangeField = (e, property, type = '') => {
		form.setValue(property, e);
	};

	const onEdit = productId => {
		const producto = productos.find(p => p._id.toString() === productId);
		if (producto) {
			setProductoIdToEdit(productId);
			form.setValue(null, producto);
			setVisible(true);
			return;
		}
		return console.error('Hubo un problema al editar un productor');
	};

	const findeProductor = productorId => {
		const productor = productores.find(p => p._id === productorId);
		if (productor) {
			return productor.name;
		}
	};

	const onDowload = () => {
		fetch('/api/products/dowload-products')
			.then(response => {
				return response.blob();
			})
			.then(blob => {
				// setFetching({ error: null, done: true, loading: false });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'productos.csv';
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.catch(error => {
				console.log(error);
			});
	};
	return (
		<Layout {...props}>
			<Header user={props.user} title={'Productos'} />
			<Container>
				<Grid.Container justify="space-between">
					<Grid>
						<Button onPress={() => setVisible(true)}> Agregar producto </Button>
					</Grid>
					<Grid>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<Button onPress={() => setVisibleCargaMasiva(true)}> Actualizacion de masiva</Button>
							<Button onPress={() => onDowload()} style={{ marginLeft: '1rem' }}>
								Descargar excel
							</Button>
						</div>
					</Grid>
				</Grid.Container>
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
							<Table.Column>Productor</Table.Column>
							<Table.Column>Precio neto</Table.Column>
							<Table.Column>Acciones</Table.Column>
						</Table.Header>
						<Table.Body>
							{productos.map(producto => (
								<Table.Row key={producto._id}>
									<Table.Cell>
										<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
											<Avatar squared src={`https://drive.google.com/uc?id=${producto.picture}&export=download`} />
											<Text css={{ paddingLeft: '1rem' }}>{producto.name}</Text>
										</div>
									</Table.Cell>
									<Table.Cell>{findeProductor(producto.seller)}</Table.Cell>
									<Table.Cell>{producto.price}</Table.Cell>
									<Table.Cell>
										<IconButton onClick={() => onEdit(producto._id)}>
											<EditIcon />
										</IconButton>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
			</Container>
			<ModalProductor
				handleChangeField={handleChangeField}
				form={form}
				visible={visible}
				onClickSave={onClickSave}
				closeHandler={closeHandler}
				productores={productores}
				tags={tags}
				modificadores={modificadores}
			/>
			<CargaMasivaModal visible={visibleCargaMasiva} closeHandler={closeHandlerCargaMasiva} />
		</Layout>
	);
}
