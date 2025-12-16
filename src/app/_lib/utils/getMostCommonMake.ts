const getMostCommonMake = (vehicles: { make: string }[]) => {
	const counts = vehicles.reduce<Record<string, number>>((acc, v) => {
		acc[v.make] = (acc[v.make] || 0) + 1;
		return acc;
	}, {});

	const mostCommon = Object.entries(counts).sort(
		(a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
	)[0][0];
	return mostCommon ?? 'N/A';
};

export { getMostCommonMake };
