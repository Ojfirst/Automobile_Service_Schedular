export type InventoryStat = {
	inventoryValue: number;
	retailValue: number;
	totalParts: number;
	outOfStock: number;
	lowStock: number;
	totalSuppliers: number;
	potentialProfit: number;
	avgMargin: number;
};

export interface InventoryStatsProps {
	stats: InventoryStat;
}
