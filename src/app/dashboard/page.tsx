export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Role } from '@prisma/client';
import { requireAdminApi } from '../_lib/auth/admin-auth';
import { getOrCreateUser } from '../_lib/auth/admin-auth';
import DashBardNav from '@/components/Navigations/dashboard-nav'
import DashboardActions from '@/components/dashboard/action-card/service-actions';
import VehiclesDB from '@/components/dashboard/vehicles'
import AddVehcileLink from '@/components/dashboard/add-vehicle.link'
import Appointments from '@/components/dashboard/appointments'
import VehicleStats from '@/components/dashboard/vehicle-statistic';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { prisma } from '@/prisma.db';
import Loading from '../_lib/utils/loading';


export default async function Dashboard() {
  const { dbUser, user } = await getOrCreateUser()
  const adminUser = await requireAdminApi();

  const vehicles = await prisma.vehicle.findMany({
    where: { ownerId: dbUser.id },
    orderBy: { createdAt: 'desc' }
  })

  if (vehicles.length === 0) {
    if (adminUser?.role === Role.ADMIN || adminUser?.role === Role.SUPER_ADMIN) {
      return redirect('/admin/')
    }
    return redirect('/dashboard/vehicles/add')
  }
  const vehicle = vehicles[0];

  const actionCards = [
    {
      href: `/book?vehicle=${vehicle.id}`,
      title: "Book Service",
      description: "Book appointment",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradientFrom: "from-blue-500",
      gradientTo: "to-purple-600",
      hoverColor: "blue",
      pulseColor: "bg-blue-500",
      progressColor: "bg-blue-500",
      hoverProgressColor: "bg-blue-400"
    },
    {
      href: "/dashboard/vehicles/add",
      title: "Add Vehicle",
      description: "Register new vehicle",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2m0 0a2 2 0 002 2h14a2 2 0 002-2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      ),
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-600",
      hoverColor: "green",
      pulseColor: "bg-green-500",
      progressColor: "bg-green-500",
      hoverProgressColor: "bg-green-400"
    },
    {
      href: "/service",
      title: "View Services",
      description: "Browse all services",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      gradientFrom: "from-purple-500",
      gradientTo: "to-pink-600",
      hoverColor: "purple",
      pulseColor: "bg-purple-500",
      progressColor: "bg-purple-500",
      hoverProgressColor: "bg-purple-400"
    },
    {
      href: "/dashboard/appointments",
      title: "Appointments",
      description: "Manage appointments",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradientFrom: "from-orange-500",
      gradientTo: "to-red-500",
      hoverColor: "orange",
      pulseColor: "bg-orange-500",
      progressColor: "bg-orange-500",
      hoverProgressColor: "bg-orange-400"
    }
  ];


  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <DashBardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <DashboardActions actionCards={actionCards} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Vehicles Section */}
          <div className="bg-gray-800 rounded-lg shadow">
            <AddVehcileLink />
            <Suspense fallback={<Loading />}>
              <VehiclesDB userId={dbUser.id} />
            </Suspense>
          </div>

          {/* Upcoming Appointments Section */}
          <Suspense fallback={<Loading />}>
            <Appointments userId={dbUser.id} />
          </Suspense>
        </div>

        {/* Stats Section */}
        <Suspense fallback={<div className='text-2xl flex justify-center items-center'>Loading vehicle statistics...</div>}>
          <VehicleStats user={user} />
        </Suspense>
      </main>
    </div>
  )
}