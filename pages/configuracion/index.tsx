import { Card, Grid, Row, Text } from '@nextui-org/react';
import Header from '../../components/navigation/Header';
import Layout from '../layout';
import { useRouter } from 'next/router';
export { getServerSideProps } from '../../src/ssp/cart';

export default function Productos(props) {
	const route = useRouter();
	return (
		<Layout {...props}>
			<Header user={props.user} title={'Configuración'} />
			<Grid.Container gap={2} justify="center">
				<Grid xs={6} sm={3} key={1}>
					<Card isPressable onClick={() => route.push('/configuracion/productores')}>
						<Card.Body css={{ p: 0 }}>
							<Card.Image src={'/img/building-factory-2.png'} width="100%" height={140} alt={'asdsa'} />
						</Card.Body>
						<Card.Footer css={{ justifyItems: 'flex-start' }}>
							<Row wrap="wrap" justify="center" align="center">
								<Text b>Productores</Text>
							</Row>
						</Card.Footer>
					</Card>
				</Grid>
				<Grid xs={6} sm={3} key={1}>
					<Card isPressable onClick={() => route.push('/configuracion/modificadores')}>
						<Card.Body css={{ p: 0 }}>
							<Card.Image src={'/img/calculator.png'} width="100%" height={140} alt={'asdsa'} />
						</Card.Body>
						<Card.Footer css={{ justifyItems: 'flex-start' }}>
							<Row wrap="wrap" justify="center" align="center">
								<Text b>Modificadores</Text>
							</Row>
						</Card.Footer>
					</Card>
				</Grid>
				<Grid xs={6} sm={3} key={1}>
					<Card isPressable onClick={() => route.push('/configuracion/tags')}>
						<Card.Body css={{ p: 0 }}>
							<Card.Image src={'/img/tags.png'} width="100%" height={140} alt={'asdsa'} />
						</Card.Body>
						<Card.Footer css={{ justifyItems: 'flex-start' }}>
							<Row wrap="wrap" justify="center" align="center">
								<Text b>Tags</Text>
							</Row>
						</Card.Footer>
					</Card>
				</Grid>
			</Grid.Container>
		</Layout>
	);
}
