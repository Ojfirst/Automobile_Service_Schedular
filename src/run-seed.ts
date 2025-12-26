import { seed } from './seed';
import { prisma } from './prisma.db';

async function main() {
	try {
		await prisma.$connect();
		await seed();
		console.log('Seeding completed.');
	} catch (e) {
		console.error('Seeding failed:', e);
		process.exitCode = 1;
	} finally {
		await prisma.$disconnect();
	}
}

main();
