export const ICON_NAMES = [
	'LayoutDashboard',
	'Calendar',
	'Wrench',
	'Car',
	'Users',
	'BarChart3',
	'Package',
	'Settings',
] as const;
export type IconName = (typeof ICON_NAMES)[number];

export interface NavItem {
	href: string;
	label: string;
	icon: IconName;
	description?: string;
}

export const adminNavItems: NavItem[] = [
	{
		href: '/admin/dashboard',
		label: 'Dashboard',
		icon: 'LayoutDashboard',
		description: 'Overview of your service center',
	},
	{
		href: '/admin/appointments',
		label: 'Appointments',
		icon: 'Calendar',
		description: 'Manage all appointments',
	},
	{
		href: '/admin/services',
		label: 'Services',
		icon: 'Wrench',
		description: 'Manage service offerings',
	},
	{
		href: '/admin/vehicles',
		label: 'Vehicles',
		icon: 'Car',
		description: 'View registered vehicles',
	},
	{
		href: '/admin/users',
		label: 'Users',
		icon: 'Users',
		description: 'Manage customer accounts',
	},
	{
		href: '/admin/analytics',
		label: 'Analytics',
		icon: 'BarChart3',
		description: 'Business insights & reports',
	},
	{
		href: '/admin/inventory',
		label: 'Inventory',
		icon: 'Package',
		description: 'Manage spare parts and stock',
	},
	{
		href: '/admin/settings',
		label: 'Settings',
		icon: 'Settings',
		description: 'System configuration',
	},
];
