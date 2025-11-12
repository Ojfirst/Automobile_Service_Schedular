import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
	const serviceCount = await prisma.service.count();
	if (serviceCount === 0) {
		await prisma.service.createMany({
			data: [
				{
					name: 'Oil Change',
					description: 'Standard oil and filter change',
					duration: 30,
					price: 49.99,
				},
				{
					name: 'Tire Rotation',
					description: 'Rotate tires and check pressure',
					duration: 45,
					price: 29.99,
				},
				{
					name: 'Brake Inspection',
					description: 'Complete brake system inspection',
					duration: 60,
					price: 39.99,
				},
			],
		});
	}
};

seed().then(() => prisma.$disconnect());

export const generateService = async () => {
	return prisma.service.findMany();
};
