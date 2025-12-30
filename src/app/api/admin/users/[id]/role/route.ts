import { prisma, RoleType } from '@/prisma.db';

import { requireAdminApi } from '@/app/_lib/auth/admin-auth';

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	await requireAdminApi();

	const body = await req.json();
	const { role } = body;

	if (
		![
			RoleType.SUPER_ADMIN,
			RoleType.ADMIN,
			RoleType.MECHANIC,
			RoleType.RECEPTIONIST,
			RoleType.USER,
		].includes(role)
	) {
		return new Response('Invalid role', { status: 400 });
	}

	const updated = await prisma.user.update({
		where: { id: params.id },
		data: { role },
	});

	return new Response(JSON.stringify({ user: updated }), { status: 200 });
}
