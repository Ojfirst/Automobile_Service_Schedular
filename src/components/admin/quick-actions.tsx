'use client'

import { useState } from 'react'
import {
  CalendarPlus,
  UserPlus,
  FileText,
  MessageSquare,
  Download,
  Send,
  Shield,
  BellRing
} from 'lucide-react'

const quickActions = [
  {
    id: 1,
    title: 'Schedule Service',
    description: 'Create new appointment',
    icon: CalendarPlus,
    color: 'from-gray-500 to-gray-700',
    action: () => console.log('Schedule service'),
  },
  {
    id: 2,
    title: 'Add Customer',
    description: 'Register new customer',
    icon: UserPlus,
    color: 'from-gray-500 to-gray-700',
    action: () => console.log('Add customer'),
  },
  {
    id: 3,
    title: 'Generate Report',
    description: 'Create monthly report',
    icon: FileText,
    color: 'from-gray-500 to-gray-700',
    action: () => console.log('Generate report'),
  },
  {
    id: 4,
    title: 'Send Notification',
    description: 'Notify customers',
    icon: MessageSquare,
    color: 'from-gray-500 to-gray-700',
    action: () => console.log('Send notification'),
  },
]

const systemActions = [
  {
    id: 1,
    title: 'Backup Data',
    description: 'Export database backup',
    icon: Download,
    color: 'bg-gray-800',
    action: () => console.log('Backup data'),
  },
  {
    id: 2,
    title: 'Send Updates',
    description: 'Push service updates',
    icon: Send,
    color: 'bg-gray-800',
    action: () => console.log('Send updates'),
  },
  {
    id: 3,
    title: 'Security Check',
    description: 'Run security audit',
    icon: Shield,
    color: 'bg-gray-800',
    action: () => console.log('Security check'),
  },
  {
    id: 4,
    title: 'System Alerts',
    description: 'Configure alerts',
    icon: BellRing,
    color: 'bg-gray-800',
    action: () => console.log('System alerts'),
  },
]

export default function QuickActions() {
  const [activeAction, setActiveAction] = useState<number | null>(null)

  const handleAction = (id: number, action: () => void) => {
    setActiveAction(id)
    // Simulate loading
    setTimeout(() => {
      action()
      setActiveAction(null)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <p className="text-sm text-gray-400">Frequently used actions</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
            4 actions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            const isActive = activeAction === action.id

            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id, action.action)}
                disabled={isActive}
                className={`
                  group relative p-4 rounded-xl border transition-all duration-300
                  ${isActive
                    ? 'bg-gray-800 border-gray-700 scale-95'
                    : 'bg-gray-800/30 border-gray-800 hover:border-gray-700 hover:scale-[1.02]'
                  }
                `}
              >
                {/* Gradient Background */}
                <div className={`
                  absolute inset-0 rounded-xl bg-gradient-to-br ${action.color} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                  ${isActive && 'opacity-20'}
                `} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    )}
                  </div>

                  <div className="text-left">
                    <h4 className="font-medium text-white text-sm mb-1">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* System Actions Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Actions</h3>

        <div className="space-y-3">
          {systemActions.map((action) => {
            const Icon = action.icon
            const isActive = activeAction === action.id + 10 // Offset to avoid conflicts

            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id + 10, action.action)}
                disabled={isActive}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl 
                  border transition-all duration-300 group
                  ${isActive
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-800/30 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-white text-sm">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className={`
                  text-xs px-2 py-1 rounded-full transition-colors
                  ${isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-500 group-hover:text-gray-400'
                  }
                `}>
                  {isActive ? 'Running...' : 'Run'}
                </div>
              </button>
            )
          })}
        </div>

        {/* System Status */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-400 font-medium">All Systems Operational</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">Last checked: Just now</span>
          </div>
        </div>
      </div>
    </div>
  )
}