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
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '50');

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

		const [parts, total] = await Promise.all([
			prisma.part.findMany({
				where,
				include: {
					supplier: true,
					_count: {
						select: {
							transactions: true,
							services: true,
						},
					},
				},
				orderBy: { name: 'asc' },
				skip: (page - 1) * limit,
				take: limit,
			}),
			prisma.part.count({ where }),
		]);

		return NextResponse.json({
			parts,
			total,
			page,
			totalPages: Math.ceil(total / limit),
		});
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

		// Validate required fields
		if (!data.name || !data.partNumber || !data.category) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

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
