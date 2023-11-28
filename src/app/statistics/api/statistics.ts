import {NextApiRequest, NextApiResponse} from 'next';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
	if (request.method === 'POST') {
		response.status(201).json(request.body);
	}

	if (request.method === 'GET') {
		response.status(200).json(await response.json());
	}

	return response.status(400).json({error: 'El método no existe'});
};

export default handler();
