import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.db';
import { Prisma } from '@prisma/client';
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

		const raw = await request.json();

		if (!raw || typeof raw !== 'object') {
			return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
		}

		const body = raw as Record<string, unknown>;

		// Validate required fields
		if (!body.name || !body.partNumber || !body.category) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Validate numeric required fields: price and cost
		if (body.price === undefined || body.cost === undefined) {
			return NextResponse.json(
				{ error: 'Missing required fields: price and cost' },
				{ status: 400 }
			);
		}

		const priceNum = Number(body.price);
		const costNum = Number(body.cost);

		if (Number.isNaN(priceNum) || Number.isNaN(costNum)) {
			return NextResponse.json(
				{ error: 'Invalid numeric values for price or cost' },
				{ status: 400 }
			);
		}

		if (priceNum < 0 || costNum < 0) {
			return NextResponse.json(
				{ error: 'Price and cost must be non-negative' },
				{ status: 400 }
			);
		}

		// Optional integer fields
		const stockNum = body.stock !== undefined ? Number(body.stock) : undefined;
		const minStockNum =
			body.minStock !== undefined ? Number(body.minStock) : undefined;
		const maxStockNum =
			body.maxStock !== undefined ? Number(body.maxStock) : undefined;

		const supplierId = body.supplierId ? String(body.supplierId) : undefined;

		const createData: Prisma.PartCreateInput = {
			name: String(body.name),
			partNumber: String(body.partNumber),
			category: String(body.category),
			description: body.description ? String(body.description) : undefined,
			manufacturer: body.manufacturer ? String(body.manufacturer) : undefined,
			location: body.location ? String(body.location) : undefined,
			price: priceNum,
			cost: costNum,
			stock:
				stockNum !== undefined && !Number.isNaN(stockNum)
					? Math.trunc(stockNum)
					: undefined,
			minStock:
				minStockNum !== undefined && !Number.isNaN(minStockNum)
					? Math.trunc(minStockNum)
					: undefined,
			maxStock:
				maxStockNum !== undefined && !Number.isNaN(maxStockNum)
					? Math.trunc(maxStockNum)
					: undefined,
			createdBy: user.id,
			supplier: supplierId ? { connect: { id: supplierId } } : undefined,
		};

		const part = await prisma.part.create({ data: createData });

		return NextResponse.json(part, { status: 201 });
	} catch (error) {
		console.error('Error creating part:', error);
		return NextResponse.json(
			{ error: 'Failed to create part' },
			{ status: 500 }
		);
	}
};
