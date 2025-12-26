import { Users, Calendar, Car, DollarSign, Wrench } from 'lucide-react';
import { Clock } from '@/app/_lib/utils/custom-clock';

export const statCards = [
	{
		key: 'todaysAppointments',
		title: "Today's Appointments",
		icon: Calendar,
		color: 'from-blue-500 to-cyan-500',
		color2: 'from-gray-500 to-gray-700',
		change: '+12%',
	},
	{
		key: 'pendingAppointments',
		title: 'Pending',
		icon: Clock,
		color: 'from-amber-500 to-orange-500',
		color2: 'from-gray-500 to-gray-700',
		change: '+3',
	},
	{
		key: 'inProgressAppointments',
		title: 'In Progress',
		icon: Wrench,
		color: 'from-emerald-500 to-green-500',
		color2: 'from-gray-500 to-gray-700',
		change: '-2',
	},
	{
		key: 'totalRevenue',
		title: 'Revenue',
		icon: DollarSign,
		color: 'from-violet-500 to-purple-500',
		color2: 'from-gray-500 to-gray-700',
		change: '+24%',
	},
	{
		key: 'totalUsers',
		title: 'Users',
		icon: Users,
		color: 'from-rose-500 to-pink-500',
		color2: 'from-gray-500 to-gray-700',
		change: '+8%',
	},
	{
		key: 'totalVehicles',
		title: 'Vehicles',
		icon: Car,
		color: 'from-sky-500 to-blue-500',
		color2: 'from-gray-500 to-gray-700',
		change: '+15%',
	},
];
