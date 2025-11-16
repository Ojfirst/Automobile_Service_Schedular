import DashBardNav from '@/components/Navigations/dashboard-nav'
import DashboardActions from '@/components/dashboard/service-actions';
import VehiclesDB from '@/components/dashboard/vehicles'
import AddVehcileLink from '@/components/dashboard/add-vehicle.link'
import Appointments from '@/components/dashboard/appointments'
import VehicleStats from '@/components/dashboard/vehicle-statistic';


export default async function Dashboard() {



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashBardNav />

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <DashboardActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Vehicles Section */}
          <div className="bg-white rounded-lg shadow">
            <AddVehcileLink />
            <VehiclesDB />
          </div>

          {/* Upcoming Appointments Section */}
          <Appointments />
        </div>

        {/* Stats Section */}
        <VehicleStats />
      </main>
    </div>
  )
}