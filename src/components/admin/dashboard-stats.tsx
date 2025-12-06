'use client'

import { Users, Calendar, Car, DollarSign, Wrench } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DashboardStatsProps {
  stats: {
    totalAppointments: number
    todaysAppointments: number
    pendingAppointments: number
    inProgressAppointments: number
    totalRevenue: number
    totalServices: number
    totalUsers: number
    totalVehicles: number
  }
}

// Custom Clock icon since it's not in lucide-react
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const statCards = [
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
]

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const [animatedValues, setAnimatedValues] = useState(stats)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues(prev => ({
        ...prev,
        todaysAppointments: stats.todaysAppointments,
        pendingAppointments: stats.pendingAppointments,
        totalRevenue: stats.totalRevenue
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [stats])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = animatedValues[card.key as keyof typeof animatedValues]

        return (
          <div
            key={card.key}
            className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 hover:border-gray-700 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color2}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.change.startsWith('+')
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-400'
                }`}>
                {card.change}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold text-white">
                {typeof value === 'number'
                  ? card.key === 'totalRevenue'
                    ? `$${value.toFixed(2)}`
                    : value.toLocaleString()
                  : value
                }
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="mt-4">
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000`}
                  style={{
                    width: `${Math.min(100, (Number(value) / 100) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}