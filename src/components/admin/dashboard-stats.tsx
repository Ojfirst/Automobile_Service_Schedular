'use client'
import { statCards } from "@/app/_lib/utils/stat-cards"


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



export default function DashboardStats({ stats }: DashboardStatsProps) {
  const animatedValues = stats

  // If you want animated transitions, we can add a requestAnimationFrame-based animation here
  // to increment values over time without triggering synchronous setState inside the effect.


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