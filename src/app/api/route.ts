import { PrismaClient } from '@/generated/prisma/client';
const prisma = new PrismaClient();

export const GET = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1500));
	const services = await prisma.service.findMany();
	return Response.json(services);
};
