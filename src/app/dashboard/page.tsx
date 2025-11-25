import { currentUser } from '@clerk/nextjs/server';
import DashBardNav from '@/components/Navigations/dashboard-nav'
import DashboardActions from '@/components/dashboard/action-card/service-actions';
import VehiclesDB from '@/components/dashboard/vehicles'
import AddVehcileLink from '@/components/dashboard/add-vehicle.link'
import Appointments from '@/components/dashboard/appointments'
import VehicleStats from '@/components/dashboard/vehicle-statistic';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Loading from '../_lib/utils/loading';


export default async function Dashboard() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <DashBardNav />

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <DashboardActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Vehicles Section */}
          <div className="bg-gray-800 rounded-lg shadow">
            <AddVehcileLink />
            <Suspense fallback={<Loading />}>
              <VehiclesDB user={user} />
            </Suspense>
          </div>

          {/* Upcoming Appointments Section */}
          <Suspense fallback={<Loading />}>
            <Appointments user={user} />
          </Suspense>
        </div>

        {/* Stats Section */}
        <Suspense fallback={<div className='text-2xl flex justify-center items-center'>Loading vehicle statistics...</div>}>
          <VehicleStats />
        </Suspense>
      </main>
    </div>
  )
}