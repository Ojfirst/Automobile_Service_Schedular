import { prisma } from '@/prisma.db'
import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AppointmentsTable from '@/components/admin/admin-sidebar/appointments-table'
import { requireAdminAuth } from '@/app/_lib/auth/admin-auth'

export default async function AppointmentsPage() {
  await requireAdminAuth()

  const appointments = await prisma.appointment.findMany({
    include: {
      user: true,
      vehicle: true,
      service: true,
    },
    orderBy: { date: 'desc' },
    take: 200,
  })

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-black">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">Appointments</h1>
            <p className="text-gray-400 mt-2">
              Manage customer appointments and status
            </p>
          </div>
          <AppointmentsTable appointments={appointments} />
        </main>
      </div>
    </div>
  )
}