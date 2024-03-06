import PageLayout from '../components/layouts/page-layout';
import Hero from '../components/landing/Hero';
import Nosotros from '../components/landing/Nosotros';
import CarrouselNoticias from '../components/landing/Noticias';
import Contacto from '../components/landing/Contacto';

export default function Home({ instagram }) {
	return (
		<PageLayout>
			<Hero />
			<Nosotros />
			<CarrouselNoticias instagram={instagram} />
		</PageLayout>
	);
}

export const getStaticProps = async ctx => {
	const apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,username,timestamp,permalink&access_token=${process.env.IG_ACCES_TOKEN}`;

	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error('Error al obtener datos de Instagram');
		}
		const instagramData = await response.json();

		return {
			props: {
				instagram: instagramData.data
			},
			revalidate: 10
		};
	} catch (error) {
		console.error('Error al obtener datos de Instagram:', error);
		return {
			props: {
				instagram: null
			}
		};
	}
};
