import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/prisma.db'
import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AnalyticsDashboard from '@/components/admin/admin-sidebar/analytics-dashboard'

export default async function AnalyticsPage() {
  const user = await currentUser()

  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/sign-in')
  }

  // Fetch data for analytics
  const [appointments, services, revenueData] = await Promise.all([
    prisma.appointment.findMany({
      include: {
        service: true,
      },
      orderBy: { date: 'desc' },
    }),
    prisma.service.findMany(),
    prisma.appointment.findMany({
      where: {
        status: 'COMPLETED',
      },
      select: {
        date: true,
        service: {
          select: {
            price: true,
          },
        },
      },
    }),
  ])

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-black">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">Analytics</h1>
            <p className="text-gray-400 mt-2">
              Business insights, reports, and performance metrics
            </p>
          </div>
          <AnalyticsDashboard
            appointments={appointments}
            services={services}
            revenueData={revenueData}
          />
        </main>
      </div>
    </div>
  )
}