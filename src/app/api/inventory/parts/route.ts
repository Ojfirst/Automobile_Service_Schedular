import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { currentUser } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';

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

		const where: Prisma.PartWhereInput = {};

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
export const POST = async (request: NextRequest) => {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const payload = await request.json();

		// Extract supplierId and numeric fields so we can shape the create input properly
		const { supplierId, price, cost, stock, minStock, maxStock, ...rest } =
			payload;

		// Validate required fields
		if (!rest.name || !rest.partNumber || !rest.category) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Coerce numeric fields if provided
		const numericData: Record<string, number> = {};
		if (price !== undefined) numericData.price = Number(price);
		if (cost !== undefined) numericData.cost = Number(cost);
		if (stock !== undefined) numericData.stock = Number(stock);
		if (minStock !== undefined) numericData.minStock = Number(minStock);
		if (maxStock !== undefined) numericData.maxStock = Number(maxStock);

		// Build create input
		const createDataBase = {
			...rest,
			...numericData,
			createdBy: user.id,
		};

		// Compose final data object (add nested supplier connect only if provided)
		const createData = supplierId
			? { ...createDataBase, supplier: { connect: { id: supplierId } } }
			: createDataBase;

		const part = await prisma.part.create({
			data: createData as Prisma.PartCreateInput,
		});

		return NextResponse.json(part, { status: 201 });
	} catch (error) {
		console.error('Error creating part:', error);
		return NextResponse.json(
			{ error: 'Failed to create part' },
			{ status: 500 }
		);
	}
};
