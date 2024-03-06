import { useRouter } from 'next/router';
import PageLayout from '../../components/layouts/page-layout';
import { Container, Text } from '@nextui-org/react';
import Image from 'next/image';

export default function Noticias({ instagram }) {
	const route = useRouter();
	const { id } = route.query;
	const post = instagram.find(p => p.id === id);
console.log(post);

	return (
		<PageLayout>
			<Container className="noticias-container">
				{post ? (
					<>
						{post.media_type === 'VIDEO' ? (
							<video width="100%" height={500} autoPlay controls>
								<source src={`${post.media_url}?mute=1`} type="video/mp4" />
							</video>
						) : (
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<Image
									src={post.media_url}
									objectFit="cover"
									width={400}
									height={500}
									alt={''}
									style={{ borderRadius: 20 }}
								/>
							</div>
						)}

						<Text style={{ paddingTop: 20 }}>{post.timestamp.split('T')[0]}</Text>
						{post.caption.split('\n\n').map((parrafo, index) => (
							<p key={index} style={{ marginTop: '1rem' }}>
								{parrafo}
							</p>
						))}
					</>
				) : null}
			</Container>
		</PageLayout>
	);
}

export const getStaticProps = async ctx => {
	const apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,username,timestamp&access_token=${process.env.IG_ACCES_TOKEN}`;

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
