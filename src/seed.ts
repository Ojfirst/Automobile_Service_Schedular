import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seed = async () => {
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
				{
					name: 'Alignment Inspection',
					description: 'Complete alignment system inspection',
					duration: 60,
					price: 39.99,
				},
				{
					name: 'Full Synthetic Oil Change',
					description: 'Premium synthetic oil and filter change',
					duration: 30,
					price: 79.99,
				},
				{
					name: 'Battery Replacement',
					description: 'Battery testing and replacement',
					duration: 45,
					price: 129.99,
				},
				{
					name: 'Air Filter Replacement',
					description: 'Engine and cabin air filter replacement',
					duration: 30,
					price: 39.99,
				},
			],
			skipDuplicates: true,
		});
	}
};

seed()
	.then(() => prisma.$disconnect())
	.catch((e) => {
		console.error(e);
		prisma.$disconnect();
	});
