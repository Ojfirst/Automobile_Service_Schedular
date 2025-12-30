import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
	console.log('🌱 Running database seed...');

	/* -------------------------------
	   Seed default services
	-------------------------------- */
	const serviceCount = await prisma.service.count();

	if (serviceCount === 0) {
		await prisma.service.createMany({
			data: [
				{
					name: 'Oil Change',
					description: 'Standard oil and filter change',
					duration: 30,
					price: 49.99,
					category: 'MAINTENANCE',
					serviceType: 'FIXED',
					vehicleTypes: ['SEDAN'],
					tags: [],
				},
				{
					name: 'Tire Rotation',
					description: 'Rotate tires and check pressure',
					duration: 45,
					price: 29.99,
					category: 'MAINTENANCE',
					serviceType: 'FIXED',
					vehicleTypes: ['SEDAN'],
					tags: [],
				},
				{
					name: 'Brake Inspection',
					description: 'Complete brake system inspection',
					duration: 60,
					price: 39.99,
					category: 'INSPECTION',
					serviceType: 'FIXED',
					vehicleTypes: ['SEDAN'],
					tags: [],
				},
			],
			skipDuplicates: true,
		});

		console.log('✅ Services seeded');
	} else {
		console.log('ℹ️ Services already exist');
	}

	/* -------------------------------
	   Ensure default admin
	-------------------------------- */
	const ADMIN_EMAIL =
		process.env.SEED_ADMIN_EMAIL ?? 'omojide.o.j@gmail.com.com';

	await prisma.user.upsert({
		where: { email: ADMIN_EMAIL },
		update: {
			role: Role.SUPER_ADMIN,
		},
		create: {
			email: ADMIN_EMAIL,
			name: 'Default Admin',
			clerkUserId: `SEED_${ADMIN_EMAIL}`, // safe placeholder
			role: Role.ADMIN,
		},
	});

	console.log('✅ Default admin ensured');
}

main()
	.catch((error) => {
		console.error('❌ Seed failed:', error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
