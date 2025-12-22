import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { currentUser } from '@clerk/nextjs/server';

interface RouteParams {
	params: {
		id: string;
	};
}

// GET single supplier with parts
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const supplier = await prisma.supplier.findUnique({
			where: { id: params.id },
			include: {
				parts: {
					include: {
						_count: {
							select: {
								services: true,
								transactions: true,
							},
						},
					},
					orderBy: { name: 'asc' },
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

// PUT update supplier
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.json();

		const supplier = await prisma.supplier.update({
			where: { id: params.id },
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
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		await prisma.supplier.delete({
			where: { id: params.id },
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
