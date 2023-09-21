import { Navbar, Link, Text, Avatar, Dropdown, Button } from '@nextui-org/react';
import { useRouter } from 'next/router';

export default function Menu() {
	const collapseItems = ['Nosotres', 'Productos', 'Productores', 'Noticias', 'Contacto'];

	const route = useRouter();

	return (
		<Navbar isBordered variant="sticky">
			<Navbar.Toggle showIn="xs" />
			<Navbar.Brand
				css={{
					'@xs': {
						w: '12%'
					}
				}}
			>
				<Avatar bordered as="button" size="md" src="/img/logo-sin-fondo.png" />
			</Navbar.Brand>
			<Navbar.Content enableCursorHighlight activeColor="warning" hideIn="xs" variant="highlight">
				<Navbar.Link href="#">Nosotres</Navbar.Link>
				<Navbar.Link href="#">Productos</Navbar.Link>
				<Navbar.Link href="#">Productores</Navbar.Link>
				<Navbar.Link href="#">Noticias</Navbar.Link>
				<Navbar.Link href="#">Contacto</Navbar.Link>
			</Navbar.Content>
			<Navbar.Content
				css={{
					'@xs': {
						w: '12%',
						jc: 'flex-end'
					}
				}}
			>
				<Navbar.Item placeholder="bottom-right">
					<Button auto flat color="primary" onClick={() => route.push('/login')}>
						Login
					</Button>
				</Navbar.Item>
			</Navbar.Content>
			<Navbar.Collapse>
				{collapseItems.map((item, index) => (
					<Navbar.CollapseItem
						key={item}
						activeColor="warning"
						css={{
							color: index === collapseItems.length - 1 ? '$warning' : ''
						}}
					>
						<Link
							color="inherit"
							css={{
								minWidth: '100%'
							}}
							href="#"
						>
							{item}
						</Link>
					</Navbar.CollapseItem>
				))}
			</Navbar.Collapse>
		</Navbar>
	);
}
