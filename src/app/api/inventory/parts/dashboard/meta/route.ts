import { prisma } from '@/prisma.db';
import { NextResponse } from 'next/server';

const GET = async () => {
	const lastUpdated = await prisma.part.aggregate({
		_max: { updatedAt: true },
	});

	return NextResponse.json({
		lastUpdated: lastUpdated._max.updatedAt?.toISOString() ?? null,
	});
};

export { GET };
