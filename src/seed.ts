import { prisma } from '@/prisma.db';
import { Role } from '@prisma/client';
import { ServiceCategory, ServiceType, VehicleType } from '@prisma/client';

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
					category: ServiceCategory.MAINTENANCE,
					serviceType: ServiceType.FIXED,
					vehicleTypes: [VehicleType.SEDAN],
					tags: [],
				},
				{
					name: 'Tire Rotation',
					description: 'Rotate tires and check pressure',
					duration: 45,
					price: 29.99,
					category: ServiceCategory.MAINTENANCE,
					serviceType: ServiceType.FIXED,
					vehicleTypes: [VehicleType.SEDAN],
					tags: [],
				},
				{
					name: 'Brake Inspection',
					description: 'Complete brake system inspection',
					duration: 60,
					price: 39.99,
					category: ServiceCategory.INSPECTION,
					serviceType: ServiceType.FIXED,
					vehicleTypes: [VehicleType.SEDAN],
					tags: [],
				},
				{
					name: 'Alignment Inspection',
					description: 'Complete alignment system inspection',
					duration: 60,
					price: 39.99,
					category: ServiceCategory.INSPECTION,
					serviceType: ServiceType.FIXED,
					vehicleTypes: [VehicleType.SEDAN],
					tags: [],
				},
				{
					name: 'Full Synthetic Oil Change',
					description: 'Premium synthetic oil and filter change',
					duration: 30,
					price: 79.99,
					category: ServiceCategory.MAINTENANCE,
					serviceType: ServiceType.FIXED,
					vehicleTypes: [VehicleType.SEDAN],
					tags: [],
				},
				{
					name: 'Battery Replacement',
					description: 'Battery testing and replacement',
					duration: 45,
					price: 129.99,
					category: ServiceCategory.REPAIR,
					serviceType: ServiceType.FIXED,
					vehicleTypes: [VehicleType.SEDAN],
					tags: [],
				},
				{
					name: 'Air Filter Replacement',
					description: 'Engine and cabin air filter replacement',
					duration: 30,
					price: 39.99,
					category: ServiceCategory.MAINTENANCE,
					serviceType: ServiceType.FIXED,
					vehicleTypes: [VehicleType.SEDAN],
					tags: [],
				},
			],
			skipDuplicates: true,
		});
	}
};

async function main() {
	console.log('🌱 Seeding default admin...');

	const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@yourdomain.com';

	await prisma.user.upsert({
		where: { email: ADMIN_EMAIL },
		update: { role: Role.ADMIN },
		create: {
			email: ADMIN_EMAIL,
			name: 'Default Admin',
			clerkUserId: 'SEED_ADMIN', // placeholder, will be linked on login
			role: Role.ADMIN,
		},
	});

	console.log('✅ Default admin ensured');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

// NOTE: Do NOT auto-run `seed()` on import. Use `npm run db:seed` (runs `src/run-seed.ts`) to seed the database in development.
