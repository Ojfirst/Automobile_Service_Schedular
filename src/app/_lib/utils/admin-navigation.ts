export interface NavItem {
	href: string;
	label: string;
	icon: string;
	description?: string;
}

export const adminNavItems: NavItem[] = [
	{
		href: '/admin',
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
		href: '/admin/settings',
		label: 'Settings',
		icon: 'Settings',
		description: 'System configuration',
	},
];
