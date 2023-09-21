import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PageLayout from '../components/layouts/page-layout';
import Menu from '../components/navigation/navbar';
import { Card, Container, Grid, Image, Row, Text } from '@nextui-org/react';

export default function Home(props) {
	const router = useRouter();

	return (
		<PageLayout>
			<Menu />
			<Grid className="hero">
				<Grid.Container justify="center" alignContent="center" >
					<Grid xs={12} xl={12} css={{ zIndex: 9000 }}>
						<Image src="/img/logo-sin-fondo.png" alt="Default Image" width={300} height={300} />
					</Grid>
					<Grid xs={12} xl={3} sm={6} md={3} lg={3} justify="center" style={{marginBottom: 300}}>
						<Text h1>Sitio en construccion</Text>
					</Grid>
				</Grid.Container>
			</Grid>
		</PageLayout>
	);
}
