import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { infoMessages } from '../../helpers/notify';
import LoginCard from '../../components/cards/LoginCard';
import MessageCard from '../../components/cards/MessageCard';
import Layout from '../../components/layouts/layout';
export { getServerSideProps } from '../../src/ssp/index';

export default function Home(props) {
	const router = useRouter();

	useEffect(() => {
		infoMessages();
		if (props.user.logged) {
			router.push('/compras-activas');
		}
	}, []);

	const RenderComponent = () => {
		if (!props.user.logged) {
			return <LoginCard />;
		}

		return <MessageCard status={props.cartStatus} />;
	};

	return <Layout {...props}>{RenderComponent()}</Layout>;
}
