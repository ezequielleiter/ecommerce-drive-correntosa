import { Grid, Image, Text } from '@nextui-org/react';
import React from 'react';

const Nosotros = () => {
	return (
		<section id='nosotros'>
		<Grid className="section" style={{ backgroundColor: '#1b446f', display: 'inline-table' }}>
			<Grid.Container justify="center" alignContent="center">
				<Grid xs={12} justify="center">
					<Text h1 color="#E9F1F2">
						Nosotres
					</Text>
				</Grid>
				<Grid.Container justify="center" alignContent="center" style={{ margin: '0 40px' }}>
					<Grid xs={12} sm={6} xl={6} css={{ zIndex: 9000 }}>
						<Image src="/img/logo-sin-fondo.png" alt="Default Image" width={300} height={300} />
					</Grid>
					<Grid xs={12} sm={6} xl={6} justify="center">
						<Text color="#E9F1F2">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pharetra auctor velit vel condimentum. Nunc
							accumsan eleifend ipsum, at venenatis erat sollicitudin nec. Donec blandit id felis eget maximus. Cras vel
							tortor sollicitudin, posuere odio at, rutrum ipsum. Nulla ac leo ultrices, eleifend sapien id, volutpat
							mauris. Etiam eget feugiat massa, nec tempor sapien. Donec ut augue sed enim convallis posuere non sit
							amet sapien. Suspendisse pretium massa tortor, mollis tempus felis feugiat sed. Maecenas at nibh
							hendrerit, sollicitudin erat et, ultrices mi. Morbi tristique eu ex quis hendrerit. Vivamus luctus arcu
							sit amet dui tristique, sit amet elementum sem tincidunt. Morbi eget dictum odio. Sed nec blandit quam.
							Cras vehicula dignissim imperdiet. Mauris vel sollicitudin nunc, vitae tristique est. Etiam ligula massa,
							pulvinar id commodo sed, aliquam et dui. Fusce vitae nulla risus. Etiam tempor augue nibh, sed sagittis
							odio lacinia sit amet. Fusce eu egestas sem. Donec sagittis tempus commodo. Vestibulum vel velit
							ultricies, pharetra erat id, ornare lorem. Integer pretium, erat a lacinia vestibulum, sem turpis rhoncus
							ante, interdum pellentesque eros nisl id mi. Nunc non augue euismod, venenatis nisl et, cursus purus.
							Fusce sit amet elit a enim commodo ultricies faucibus et elit. In hac habitasse platea dictumst.
						</Text>
					</Grid>
				</Grid.Container>
			</Grid.Container>
		</Grid>
		</section>
	);
};

export default Nosotros;
