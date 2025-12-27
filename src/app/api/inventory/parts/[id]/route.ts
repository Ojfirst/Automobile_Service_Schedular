import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { Prisma } from '@prisma/client';
import { requireAdminApi } from '@/app/_lib/auth/admin-auth';

interface RouteParams {
	params: Promise<{ id: string }>;
}

// GET single part
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const dbUser = await requireAdminApi();
		if (!dbUser) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const paramsId = await params;

		const part = await prisma.part.findUnique({
			where: { id: paramsId.id },
			include: {
				supplier: true,
				transactions: {
					orderBy: { createdAt: 'desc' },
					take: 20,
				},
				services: {
					include: {
						service: true,
					},
				},
			},
		});

		if (!part) {
			return NextResponse.json({ error: 'Part not found' }, { status: 404 });
		}

		return NextResponse.json(part);
	} catch (error) {
		console.error('Error fetching part:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch part' },
			{ status: 500 }
		);
	}
}

// PUT update part
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const dbUser = await requireAdminApi();
		if (!dbUser) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const paramsId = await params;

		// Validate the route param early to avoid calling Prisma with undefined
		if (!paramsId?.id) {
			console.error('Missing route parameter `id` in PUT request', {
				params,
				url: request.url,
			});
			return NextResponse.json(
				{ error: 'Missing id parameter' },
				{ status: 400 }
			);
		}

		const data = await request.json();

		// Normalize empty supplierId to null so we don't attempt to set an invalid FK
		if (
			'supplierId' in data &&
			(data.supplierId === '' || data.supplierId === undefined)
		) {
			data.supplierId = null;
		}

		// If a supplierId is provided (non-null), verify the supplier exists
		if (data.supplierId) {
			const supplierExists = await prisma.supplier.findUnique({
				where: { id: data.supplierId },
			});
			if (!supplierExists) {
				console.error(
					'Invalid supplierId provided in update:',
					data.supplierId
				);
				return NextResponse.json(
					{ error: 'Invalid supplierId: supplier not found' },
					{ status: 400 }
				);
			}
		}

		// Perform update and handle FK errors gracefully
		try {
			const part = await prisma.part.update({
				where: { id: paramsId.id },
				data,
			});

			return NextResponse.json(part);
		} catch (e) {
			// Prisma Foreign Key violation (P2003)
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === 'P2003'
			) {
				console.error(
					'Foreign key constraint violated when updating part:',
					e.meta || e.message
				);
				return NextResponse.json(
					{ error: 'Invalid supplierId: foreign key constraint failed' },
					{ status: 400 }
				);
			}
			throw e;
		}
	} catch (error) {
		console.error('Error updating part:', error);
		return NextResponse.json(
			{ error: 'Failed to update part' },
			{ status: 500 }
		);
	}
}

// DELETE part
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const dbUser = await requireAdminApi();
		if (!dbUser) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const paramsId = await params;

		if (!paramsId?.id) {
			console.error('Missing route parameter `id` in DELETE request', {
				params,
				url: request.url,
			});
			return NextResponse.json(
				{ error: 'Missing id parameter' },
				{ status: 400 }
			);
		}

		await prisma.part.delete({
			where: { id: paramsId.id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting part:', error);
		return NextResponse.json(
			{ error: 'Failed to delete part' },
			{ status: 500 }
		);
	}
}
