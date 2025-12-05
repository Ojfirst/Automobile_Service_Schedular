import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/prisma.db'
import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import DashboardStats from '@/components/admin/dashboard-stats'
import RecentAppointments from '@/components/admin/recent-appointments'
import QuickActions from '@/components/admin/quick-actions'

const AdminDashboard = async () => {

  const user = await currentUser()

  // Redirect if not authenticated
  if (!user) {
    redirect('/sign-in')
  }

  // Check admin role using metadata
  const role = user.publicMetadata?.role
  if (role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch data in parallel for better performance
  const [appointments, services, users, vehicles] = await Promise.all([
    prisma.appointment.findMany({
      include: {
        service: true,
        vehicle: true,
        user: true,
      },
      orderBy: { date: 'desc' },
      take: 20,
    }),
    prisma.service.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.vehicle.findMany({
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  // Calculate statistics
  const today = new Date()
  const todayStart = new Date(today.setHours(0, 0, 0, 0))
  const todayEnd = new Date(today.setHours(23, 59, 59, 999))

  const stats = {
    totalAppointments: appointments.length,
    todaysAppointments: appointments.filter(a =>
      new Date(a.date) >= todayStart && new Date(a.date) <= todayEnd
    ).length,
    pendingAppointments: appointments.filter(a => a.status === 'PENDING').length,
    inProgressAppointments: appointments.filter(a => a.status === 'IN_PROGRESS').length,
    totalRevenue: appointments
      .filter(a => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + a.service.price, 0),
    totalServices: services.length,
    totalUsers: users.length,
    totalVehicles: vehicles.length,
  }

  return (
    <div className="min-h-screen">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6 lg:p-8 bg-black">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">
              <span className='text-blue-500 text-2xl'>Welcome back</span>, {user.firstName}!
            </h1>
            <p className="text-gray-400 mt-2">
              Here&apos;s what&apos;s happening with your service center today.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <DashboardStats stats={stats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <RecentAppointments appointments={appointments} />
            </div>

            <div className="space-y-6">
              <QuickActions />

              {/* Recent Users */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Recent Users
                </h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard;