import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { requireAdminApi } from '@/app/_lib/auth/admin-auth';

interface RouteParams {
	params: Promise<{ id: string }>;
}

// GET supplier
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const dbUser = await requireAdminApi();
		if (!dbUser) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const paramsId = await params;

		const supplier = await prisma.supplier.findUnique({
			where: { id: paramsId.id },
			include: {
				parts: {
					orderBy: { createdAt: 'desc' },
					take: 20,
				},
				_count: {
					select: {
						parts: true,
					},
				},
			},
		});

		if (!supplier) {
			return NextResponse.json(
				{ error: 'Supplier not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(supplier);
	} catch (error) {
		console.error('Error fetching supplier:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch supplier' },
			{ status: 500 }
		);
	}
}

// PUT supplier
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const dbUser = await requireAdminApi();
		if (!dbUser) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const paramsId = await params;

		if (!paramsId?.id) {
			return NextResponse.json(
				{ error: 'Missing id parameter' },
				{ status: 400 }
			);
		}

		const data = await request.json();

		const supplier = await prisma.supplier.update({
			where: { id: paramsId.id },
			data,
		});

		return NextResponse.json(supplier);
	} catch (error) {
		console.error('Error updating supplier:', error);
		return NextResponse.json(
			{ error: 'Failed to update supplier' },
			{ status: 500 }
		);
	}
}

// DELETE supplier
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const dbUser = await requireAdminApi();
		if (!dbUser) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const paramsId = await params;

		if (!paramsId?.id) {
			return NextResponse.json(
				{ error: 'Missing id parameter' },
				{ status: 400 }
			);
		}

		await prisma.supplier.delete({
			where: { id: paramsId.id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting supplier:', error);
		return NextResponse.json(
			{ error: 'Failed to delete supplier' },
			{ status: 500 }
		);
	}
}
