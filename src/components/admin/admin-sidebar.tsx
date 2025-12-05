'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  Car,
  Users,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  LogOut,
} from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/vehicles', label: 'Vehicles', icon: Car },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`
      h-[calc(100vh-73px)] sticky top-[73px] 
      bg-black backdrop-blur-sm border-r border-gray-800
      ${isCollapsed ? 'w-20' : 'w-64'} 
      transition-all duration-300 ease-in-out
    `}>
      <div className="p-4">
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full mb-6 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl flex items-center justify-center transition-colors group"
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-gray-400 group-hover:text-white" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
          )}
        </button>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-gray-900 text-white border border-gray-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-gray-200' : ''}`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-800"></div>

        {/* Sign Out */}
        {!isCollapsed && (
          <div className="p-3 bg-gray-800/30 rounded-xl">
            <SignOutButton>
              <button className="flex items-center gap-3 w-full p-2 text-gray-400 hover:text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        )}

        {/* Version Info */}
        {!isCollapsed && (
          <div className="absolute bottom-6 left-4 right-4">
            <p className="text-xs text-gray-500 text-center">
              v2.0 • AutoCare Pro
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}