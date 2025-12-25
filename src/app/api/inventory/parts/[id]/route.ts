import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { currentUser } from '@clerk/nextjs/server';

interface RouteParams {
	params: Promise<{ id: string }>;
}

// GET single part
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
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
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
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

		const part = await prisma.part.update({
			where: { id: paramsId.id },
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
