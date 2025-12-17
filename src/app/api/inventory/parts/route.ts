import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { currentUser } from '@clerk/nextjs/server';

// GET all parts
export async function GET(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const category = searchParams.get('category');
		const search = searchParams.get('search');

		const where: any = {};

		if (category && category !== 'all') {
			where.category = category;
		}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ partNumber: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } },
			];
		}

		const parts = await prisma.part.findMany({
			where,
			include: {
				supplier: true,
			},
			orderBy: { name: 'asc' },
		});

		return NextResponse.json(parts);
	} catch (error) {
		console.error('Error fetching parts:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch parts' },
			{ status: 500 }
		);
	}
}

// POST create new part
export async function POST(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.json();

		const part = await prisma.part.create({
			data: {
				...data,
				createdBy: user.id,
			},
		});

		return NextResponse.json(part, { status: 201 });
	} catch (error) {
		console.error('Error creating part:', error);
		return NextResponse.json(
			{ error: 'Failed to create part' },
			{ status: 500 }
		);
	}
}
