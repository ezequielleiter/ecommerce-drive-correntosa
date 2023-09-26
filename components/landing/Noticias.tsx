import { Card, Grid, Image, Text } from '@nextui-org/react';
import { useKeenSlider } from 'keen-slider/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CarrouselNoticias = ({ instagram }) => {
	const [sliderRef] = useKeenSlider({
		slides: {
			perView: 4,
			spacing: 0
		}
	});
	const route = useRouter();

	return (
		<section id='noticias'>
		<Grid className="section" style={{ backgroundColor: '#E9F1F2', display: 'inline-table'}}>
			<Grid.Container style={{marginTop: 20}}>
				<Grid xs={12}>
					<Text h1 color="#023859">
						Noticias
					</Text>
				</Grid>
			</Grid.Container>
			<div ref={sliderRef} className="keen-slider aling-center"  style={{marginBottom: 50}}>
				{instagram?.map(post => (
					<div className={`keen-slider__slide number-slide`}>
						<Grid.Container>
							<Grid xs={6} sm={10}>
								<Card >
									<Card.Body css={{ p: 0 }}>
										{post.media_type === 'VIDEO' ? (
											<video width="100%" className='card' autoPlay muted>
												<source src={`${post.media_url}?mute=1`} type="video/mp4" />
											</video>
										) : (
											<Card.Image src={post.media_url} objectFit="cover" width="100%" className='card'  alt={''} />
										)}
									</Card.Body>
									<Card.Footer css={{ justifyItems: 'flex-start' }}>
										<Grid.Container>
											<Grid xs={6}>
												<Text style={{ textOverflow: 'ellipsis' }}>{post.caption.slice(0, 25)} ...</Text>
											</Grid>
											<Grid xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
												<Link href={`/noticias?id=${post.id}`}>Ver más</Link>
											</Grid>
										</Grid.Container>
									</Card.Footer>
								</Card>
							</Grid>
						</Grid.Container>
					</div>
				))}
			</div>
		</Grid>
		</section>
	);
};

export default CarrouselNoticias;
