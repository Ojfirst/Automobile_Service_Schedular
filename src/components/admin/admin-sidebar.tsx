'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem } from '@/app/_lib/utils/admin-navigation';
import { adminNavItems } from '@/app/_lib/utils/admin-navigation';
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  Car,
  Users,
  BarChart3,
  Package,
  Settings,
  Menu,
  ChevronLeft,
  LogOut,
} from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'

// interface NavItem {
//   href: string
//   label: string
//   icon: string
//   description?: string
// }

// const navItems: NavItem[] = [
//   {
//     href: '/admin',
//     label: 'Dashboard',
//     icon: 'LayoutDashboard',
//     description: 'Overview of your service center'
//   },
//   {
//     href: '/admin/appointments',
//     label: 'Appointments',
//     icon: 'Calendar',
//     description: 'Manage all appointments'
//   },
//   {
//     href: '/admin/services',
//     label: 'Services',
//     icon: 'Wrench',
//     description: 'Manage service offerings'
//   },
//   {
//     href: '/admin/vehicles',
//     label: 'Vehicles',
//     icon: 'Car',
//     description: 'View registered vehicles'
//   },
//   {
//     href: '/admin/users',
//     label: 'Users',
//     icon: 'Users',
//     description: 'Manage customer accounts'
//   },
//   {
//     href: '/admin/inventory',
//     label: 'Inventory',
//     icon: 'Package',
//     description: 'Manage spare parts and stock',
//   },
//   {
//     href: '/admin/analytics',
//     label: 'Analytics',
//     icon: 'BarChart3',
//     description: 'Business insights & reports'
//   },
//   {
//     href: '/admin/settings',
//     label: 'Settings',
//     icon: 'Settings',
//     description: 'System configuration'
//   },
// ]

const navItems: NavItem[] = adminNavItems;

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard: LayoutDashboard,
  Calendar: Calendar,
  Wrench: Wrench,
  Car: Car,
  Users: Users,
  BarChart3: BarChart3,
  Package: Package,
  Settings: Settings,
}

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`
      h-[calc(100vh-73px)] sticky top-[73px] 
      bg-black backdrop-blur-sm border-r border-gray-800
      ${isCollapsed ? 'w-20' : 'w-64'} 
      transition-all duration-300 ease-in-out
      flex flex-col
    `}>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full mb-6 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl flex items-center justify-center transition-colors group"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
            const Icon = iconMap[item.icon]
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all group
                  ${isActive
                    ? 'bg-gray-900 text-white border border-gray-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
                title={isCollapsed ? `${item.label} - ${item.description}` : ''}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-gray-200' : ''}`} />
                {!isCollapsed && (
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-gray-500 truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 p-4">
        {/* Sign Out - Always visible but adapts to collapsed state */}
        <div className={`${isCollapsed ? 'flex justify-center' : ''}`}>
          <SignOutButton>
            <button
              className={`
                flex items-center gap-3 p-2 rounded-lg transition-colors
                text-gray-400 hover:text-red-400 hover:bg-gray-800/50
                ${isCollapsed ? 'w-12 h-12 justify-center' : 'w-full'}
              `}
              title={isCollapsed ? "Sign Out" : ""}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && (
                <span className="font-medium">Sign Out</span>
              )}
            </button>
          </SignOutButton>
        </div>

        {/* Version Info - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              v2.0 • AutoCare Pro
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}