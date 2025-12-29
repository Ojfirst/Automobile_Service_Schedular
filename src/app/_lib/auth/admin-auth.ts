import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/prisma.db';
import { Role } from '@prisma/client';

export const getOrCreateUser = async () => {
	const user = await currentUser();
	if (!user) redirect('/sign-in');

	let dbUser = await prisma.user.findUnique({
		where: { clerkUserId: user.id },
	});

	if (!dbUser) {
		dbUser = await prisma.user.create({
			data: {
				clerkUserId: user.id,
				email: user.emailAddresses[0]?.emailAddress ?? '',
				name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
				role: 'USER',
			},
		});
	}

	return { dbUser, user };
};

// helper for user API routes: returns dbUser if the current user is authenticated, otherwise null
export const requireUserApi = async () => {
	const user = await currentUser();

	if (!user) return null;
	const dbUser = await prisma.user.findUnique({
		where: { clerkUserId: user.id },
	});
	if (!dbUser) return null;
	return dbUser;
};

export const requireAdminAuth = async () => {
	const { dbUser } = await getOrCreateUser();

	if (dbUser.role !== Role.ADMIN && dbUser.role !== Role.SUPER_ADMIN) {
		redirect('/dashboard');
	}

	return dbUser;
};

// Helper for API routes: returns dbUser if the current user is an ADMIN, otherwise returns null
export const requireAdminApi = async () => {
	const user = await currentUser();
	if (!user) return null;

	const dbUser = await prisma.user.findUnique({
		where: { clerkUserId: user.id },
	});

	if (!dbUser) return null;
	if (dbUser.role !== Role.ADMIN && dbUser.role !== Role.SUPER_ADMIN)
		return null;

	return dbUser;
};
