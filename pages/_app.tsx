import 'reflect-metadata';
import '../sass/base.scss';
import 'react-toastify/dist/ReactToastify.css';
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import { AppCtxProvider } from '../src/context';
import { AppSalesProvider } from '../src/salescontext';

const MyApp = ({ Component, pageProps }) => {
	const initialState = {
		openDate: '',
		closeDate: '',
		name: '',
		_id: ''
	};

	return (
		<NextUIProvider>
			<AppSalesProvider currentsales={initialState}>
				<AppCtxProvider cart={pageProps.cart}>
						<Component {...pageProps} />
						<ToastContainer />
				</AppCtxProvider>
			</AppSalesProvider>
		</NextUIProvider>
	);
};

export default MyApp;
