import Head from 'next/head';
import Footer from '../components/navigation/Footer';

type Props = {
	children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<>
			<Head>
				<title>Mutual La Correntosa</title>
				<meta content="width=device-width, initial-scale=1.0" name="viewport" />
			</Head>
			<div className="page-wrapper">
				{children}
				<Footer />
			</div>
		</>
	);
};

export default Layout;
