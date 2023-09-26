import Head from 'next/head';
import Footer from '../navigation/Footer';
import Menu from '../navigation/navbar';
import Contacto from '../landing/Contacto';

type Props = {
	children: React.ReactNode;
};

const PageLayout: React.FC<Props> = ({ children }) => {
	return (
		<>
			<Head>
				<title>Mutual La Correntosa</title>
				<meta content="width=device-width, initial-scale=1.0" name="viewport" />
			</Head>
			<div className="page-wrapper">
				<Menu />
				{children}
				<Contacto/>
				<Footer />
			</div>
		</>
	);
};

export default PageLayout;
