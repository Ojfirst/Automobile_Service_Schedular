import { prisma } from '@/prisma.db'
import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import VehiclesTable from '@/components/admin/admin-sidebar/vehicles-table';
import { requireAdminAuth } from '@/app/_lib/auth/admin-auth'

export default async function VehiclesPage() {
  await requireAdminAuth()

  const vehicles = await prisma.vehicle.findMany({
    include: {
      owner: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-black">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">Vehicles</h1>
            <p className="text-gray-400 mt-2">
              View all registered vehicles in the system
            </p>
          </div>
          <VehiclesTable vehicles={vehicles} />
        </main>
      </div>
    </div>
  )
}