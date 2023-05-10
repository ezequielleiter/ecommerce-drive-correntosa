import React from 'react';
import { Text, Button, Badge, Image, Dropdown, Avatar } from '@nextui-org/react';
import { Cart, UserLogged } from '../../src/global/types';
import { useRouter } from 'next/router';
import { CartIcon } from '../svg/CartIcon';

type HeaderProps = {
	title: string;
	user: UserLogged;
	cart?: Cart;
	saleName?: string;
	orderUserName?: string;
};

const Header: React.FC<HeaderProps> = ({ title, user, cart, saleName, orderUserName }) => {
	const router = useRouter();

	return (
		<div className="header">
			{user.logged && (
				<div className="buttons-container">
					<div style={{ cursor: 'pointer' }}>
						<Image
							width={60}
							onClick={() => router.push('/compras-activas')}
							src="/../../img/logo-blanco-sin-fondo.png"
							objectFit="contain"
						/>
					</div>
					<div className="sessions-buttons">
						{cart && (
							<Badge
								css={{ cursor: 'pointer' }}
								color="warning"
								content={cart.products?.length}
								shape="circle"
								onClick={() => router.push('/cart')}
							>
								<CartIcon fill="white" size={30} width={24} height={24} onClick={() => router.push('/cart')} />
							</Badge>
						)}
						<Dropdown placement="bottom-left">
							<Dropdown.Trigger>
								<Avatar
									style={{ margin: '0rem 2rem' }}
									bordered
									size="lg"
									as="button"
									color="secondary"
									src={
										user.profile_picture ? user.profile_picture : 'https://api.dicebear.com/5.x/thumbs/svg?scale=100'
									}
								/>
							</Dropdown.Trigger>
							<Dropdown.Menu color="secondary" aria-label="Avatar Actions">
								<Dropdown.Item key="profile" css={{ height: '$18' }}>
									<Text b color="inherit" css={{ d: 'flex' }}>
										Ingresaste como
									</Text>
									<Text b color="inherit" css={{ d: 'flex' }}>
										{user.name}
									</Text>
								</Dropdown.Item>
								<Dropdown.Item key="inicio" withDivider>
									<Text onClick={() => router.push('/compras-activas')}>Inicio</Text>
								</Dropdown.Item>
								<Dropdown.Item key="mis-compras"><Text onClick={() => router.push('/mis-compras')}>Mis compras</Text></Dropdown.Item>
								{user.isAdmin || user.isSuperAdmin  ? (
									<Dropdown.Item key="admin" withDivider>
										<Text onClick={() => router.push('/admin')}>Administrar compras</Text>
									</Dropdown.Item>
								) : null}
								{user.isAdmin || user.isSuperAdmin  ? (
									<Dropdown.Item key="config">
										<Text onClick={() => router.push('/configuracion')}>Configuración</Text>
									</Dropdown.Item>
								) : null}
								<Dropdown.Item key="logout" color="error" withDivider>
									<Text onClick={() => router.push('/api/logout')} color="error">
										Salir
									</Text>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
				</div>
			)}
			{saleName ? (
				<Text className="header-compra" css={{ fontWeight: '700' }}>
					{saleName}
				</Text>
			) : null}	
			<Text className="header-text" css={{ fontWeight: '700' }}>
				{title}
			</Text>
			{orderUserName ? (
				<Text className="header-compra" css={{ fontWeight: '700' }}>
					{orderUserName}
				</Text>
			) : null}
		</div>
	);
};

export default Header;
