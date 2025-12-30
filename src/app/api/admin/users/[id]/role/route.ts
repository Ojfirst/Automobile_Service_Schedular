import { prisma, RoleType } from '@/prisma.db';

import { requireAdminApi } from '@/app/_lib/auth/admin-auth';

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id?: string }> }
) {
	const superAdmin = await requireAdminApi();

	if (superAdmin?.role !== RoleType.SUPER_ADMIN) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), {
			status: 401,
		});
	}

	const { id } = await params;

	if (!id) {
		return new Response(JSON.stringify({ message: 'User ID is required' }), {
			status: 400,
		});
	}

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
		return new Response(JSON.stringify({ message: 'Invalid role' }), {
			status: 400,
		});
	}

	const updated = await prisma.user.update({
		where: { id },
		data: { role },
	});

	return new Response(JSON.stringify({ user: updated }), { status: 200 });
}
