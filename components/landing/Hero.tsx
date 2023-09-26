import { Grid, Image, Text } from '@nextui-org/react';
import React, { FC } from 'react';

const Hero: FC = () => {
	return (
		<Grid className="hero">
			<Grid.Container justify="center" alignContent="center">
				<Grid xs={12} xl={12}>
					<Image src="/img/logo-sin-fondo.png" alt="Default Image" width={300} height={300} />
				</Grid>
				<Grid xs={12} xl={3} sm={6} md={3} lg={3} justify="center" style={{ marginBottom: 300 }}>
					<Text h1>Sitio en construccion</Text>
				</Grid>
			</Grid.Container>
		</Grid>
	);
};

export default Hero;
