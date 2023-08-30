import { Grid, Container, Row, Pagination, Loading, Input, Text, Button } from '@nextui-org/react';
import React, { useContext, useEffect, useState } from 'react';
import ProductCard from '../components/cards/ProductCard';
import { getCategories, getProductsBySale, getuserOrderBySale } from '../helpers/content';
import Header from '../components/navigation/Header';
import CategorySelector from '../components/CategorySelector';
import { infoMessages } from '../helpers/notify';
import Layout from './layout';
import ButtonCart from '../components/ButtonCart';
import useDebounce from '../src/hooks/debounceHook';
import { useAppCtx } from '../src/context';
import { SalesCtx } from '../src/salescontext';
import { useRouter } from 'next/router';
import { ArrowScroll } from '../components/svg/ArrowScroll';
import BottomMobileBar from '../components/cards/BottomMobileBar';
export { getServerSideProps } from '../src/ssp/products';

export default function Products(props) {
	const cart = useAppCtx();
	const { saleSelected } = useContext(SalesCtx);
	const salesId = saleSelected._id;
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState('');
	const [categories, setCategories] = useState([{ key: '', name: 'Todas las categorías' }]);
	const [category, setCategory] = useState({ key: '', name: 'Todas las categorías' });
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [visible, setVisible] = useState(false);
	const route = useRouter();
	const debouncedSearch = useDebounce(search, 750);
	const addProductToCart = (product, qty) => {
		cart.addProduct({ ...product, qty });
	};

	function handleScroll() {
		const currentPosition = window.pageYOffset;
		if (currentPosition > 100) {
			setVisible(true);
		} else {
			setVisible(false);
		}
	}

	function handleClickScrollUp() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	useEffect(() => {
		if (saleSelected._id.length === 0) {
			route.push('/admin');
		}
		infoMessages();
		const userOrderBySale = getuserOrderBySale(props.user.id, saleSelected._id).then(res => {
			const parseRes = JSON.parse(res)
			cart.setCarBySale(parseRes);
		});
		const productsBySale = getProductsBySale({
			id: salesId,
			isProductsIds: true
		}).then(res => {
			const productos = JSON.parse(res)
			setLoading(true);
			setProducts(productos);
			setTotalPages(res.totalPaginas);
			setLoading(false);
		});
		const category = getCategories().then(res => {
			let categoriesParsed = [];
			res.map(category => categoriesParsed.push({ key: category.slug, name: category.name }));
			setCategories([{ key: '', name: 'Todas las categorías' }, ...categoriesParsed]);
		});

		Promise.all([userOrderBySale, productsBySale,  category])
	}, []);

	const fetchData = (salesId, page, category, debouncedSearch) => {
		getProductsBySale({id: salesId, page, category: category.key, search: debouncedSearch}).then(res => {
			setCurrentPage(page);
			setProducts(res.productos);
			setTotalPages(res.totalPaginas);
			handleClickScrollUp();
		});
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		if (saleSelected._id.length === 0) {
			route.push('/admin');
		}
		setProducts([]);
		setCurrentPage(1);
		fetchData(salesId, 1, category, debouncedSearch);
	}, [category, debouncedSearch]);

	return (
		<Layout>
			<Header
				saleName={saleSelected.name}
				title="Elegí el rubro y encontrá tus productos"
				user={props.user}
				cart={cart}
			/>
			<Container css={{ backgroundColor: '#fff', maxWidth: '1260px' }}>
				<Button
					auto
					color="error"
					className={visible ? 'scroll-up-button visible' : 'scroll-up-button'}
					onClick={handleClickScrollUp}
					icon={<ArrowScroll color="#F2F3F3" />}
				/>
				<Row css={{ backgroundColor: 'transparent', marginTop: '-1.4rem' }} className="search-row">
					<Input
						placeholder="Buscá un producto..."
						clearable
						fullWidth
						className="input-search"
						onChange={e => setSearch(e.target.value)}
					></Input>
					<CategorySelector categories={categories} setCategory={val => setCategory(val)} category={category} />
				</Row>
				{loading ? (
					<Grid>
						<Loading type="points-opacity" />
					</Grid>
				) : (
					<>
						<Grid.Container gap={1} css={{ padding: 0, backgroundColor: '#fff' }}>
							{products && products.length === 0 ? (
								<Text>No se encontraron productos para tu busqueda</Text>
							) : (
								products &&
								products.map(item =>
									item.stock ? (
										<Grid xs={12} sm={12} md={6} lg={4} xl={4} key={item.code}>
											<ProductCard
												addProduct={(product, qty) => addProductToCart(product, qty)}
												item={item}
												key={item._id}
											/>
										</Grid>
									) : null
								)
							)}
						</Grid.Container>
						<Grid.Container gap={2} css={{ padding: 0 }}>
							<Grid justify="center" md={12} lg={12} xl={12} xs={12} sm={12}>
								<Pagination
									className={'paginator'}
									initialPage={1}
									total={totalPages}
									onChange={page => fetchData(salesId, page, category, debouncedSearch)}
									color="warning"
									page={currentPage}
									onClick={handleClickScrollUp}
								/>
							</Grid>
						</Grid.Container>
					</>
				)}
			</Container>
			{cart.products?.length > 0 && <ButtonCart cart={cart} />}
			<BottomMobileBar cart={cart} />
		</Layout>
	);
}
