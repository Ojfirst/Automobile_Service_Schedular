import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { currentUser } from '@clerk/nextjs/server';

interface RouteParams {
	params: {
		id: string;
	};
}

// GET single part
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const part = await prisma.part.findUnique({
			where: { id: params.id },
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
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.json();

		const part = await prisma.part.update({
			where: { id: params.id },
			data,
		});

		return NextResponse.json(part);
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
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		await prisma.part.delete({
			where: { id: params.id },
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
