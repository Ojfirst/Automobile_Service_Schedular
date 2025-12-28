import { requireAdminAuth } from '@/app/_lib/auth/admin-auth'
import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AnalyticsDashboard from '@/components/admin/admin-sidebar/analytics-dashboard'
import { prisma } from '@/prisma.db'

export default async function AnalyticsPage() {
  await requireAdminAuth()

  const [appointments, services, vehicle] = await Promise.all([
    prisma.appointment.findMany({
      include: { service: true, vehicle: true, user: true },
      orderBy: { date: 'desc' },
      take: 200,
    }),
    prisma.service.findMany(),
    prisma.vehicle.findMany()
  ])


  const revenueData = appointments.map(a => ({ date: a.date, service: { price: a.service.price } }))

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-black">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">Analytics</h1>
            <p className="text-gray-400 mt-2">View usage and appointment analytics</p>
          </div>
          <AnalyticsDashboard appointments={appointments} services={services} revenueData={revenueData} vehicles={vehicle} />
        </main>
      </div>
    </div>
  )
}