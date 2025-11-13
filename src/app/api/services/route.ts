import { prisma } from '@/prisma.db';

export const GET = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1500));
	const services = await prisma.service.findMany({
		orderBy: {
			name: 'asc',
		},
	});
	return Response.json(services);
};
