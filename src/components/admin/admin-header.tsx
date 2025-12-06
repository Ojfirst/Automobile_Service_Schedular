"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, Settings } from 'lucide-react'

export default function AdminHeader() {
  const pathname = usePathname()
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="hidden sm:inline bg-gray-200 bg-clip-text text-transparent">
                AutoCare Admin
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2 text-sm text-gray-200">
              <span>/</span>
              <span className="capitalize">
                {pathname.split('/').filter(Boolean).pop() || 'dashboard'}
              </span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Profile */}
            <div className="flex items-center gap-3 border-l border-gray-800 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border-2 border-gray-700",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}