import { NextApiResponse, NextApiRequest } from 'next';
import { withSessionRoute } from '../../src/utils/withIronSession';

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		req.session.destroy();

		res.redirect('/login');
	} catch (e) {
		res.json(e);
	}
};

export default withSessionRoute(logout);
