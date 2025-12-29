import { prisma } from '@/prisma.db';
import { requireAdminApi } from '@/app/_lib/auth/admin-auth';

export const GET = async () => {
	await requireAdminApi();

	const users = await prisma.user.findMany({
		select: { id: true, name: true, email: true, role: true },
	});

	return new Response(JSON.stringify({ users }), { status: 200 });
};
