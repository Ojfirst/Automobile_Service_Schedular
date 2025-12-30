import { PrismaClient, Role } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ['query', 'error', 'warn'],
	});

export const RoleType = Role;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
