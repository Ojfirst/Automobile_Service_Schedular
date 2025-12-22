import { prisma } from '@/prisma.db';

export const getInventoryData = async () => {
	try {
		const [parts, lowStockParts, recentTransactions, suppliers] =
			await Promise.all([
				prisma.part.findMany({
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
				}),

				prisma.part.findMany({
					where: {
						stock: {
							lte: prisma.part.fields.minStock,
						},
					},
					include: {
						supplier: true,
					},
					orderBy: { stock: 'asc' },
					take: 10,
				}),

				prisma.inventoryTransaction.findMany({
					include: {
						part: {
							include: {
								supplier: true,
							},
						},
					},
					orderBy: { createdAt: 'desc' },
					take: 20,
				}),

				prisma.supplier.findMany({
					orderBy: { name: 'asc' },
				}),
			]);

		return {
			parts,
			lowStockParts,
			recentTransactions,
			suppliers,
		};
	} catch (error) {
		console.error('Error fetching inventory data:', error);
		// Return empty arrays as fallback
		return {
			parts: [],
			lowStockParts: [],
			recentTransactions: [],
			suppliers: [],
		};
	}
};
