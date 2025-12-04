import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard | AutoCare Pro',
  description: 'Service center administration panel',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {children}
      </div>
    </div>
  )
}