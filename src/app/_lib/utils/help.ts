

// Generate year options (last 30 years)
const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
