import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/prisma.db'
import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import ServicesManager from '@/components/admin/admin-sidebar/services-manager'

export default async function ServicesPage() {
  const user = await currentUser()

  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/sign-in')
  }

  const services = await prisma.service.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-black">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">Services</h1>
            <p className="text-gray-400 mt-2">
              Manage your service offerings and pricing
            </p>
          </div>
          <ServicesManager services={services} />
        </main>
      </div>
    </div>
  )
}