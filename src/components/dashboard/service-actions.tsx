import Link from "next/link";

const DashboardActions = () => {

  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <Link
      href="/service"
      className="bg-gray-900 rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-blue-500"
    >
      <div className="flex items-center gap-4">
        <div className="bg-gray-950 p-3 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-200">Book Service</h3>
          <p className="text-sm text-gray-400">Schedule new appointment</p>
        </div>
      </div>
    </Link>

    <Link
      href="/dashboard/vehicles/add"
      className="bg-gray-900 rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-green-500"
    >
      <div className="flex items-center gap-4">
        <div className="bg-gray-950 p-3 rounded-lg">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2m0 0a2 2 0 002 2h14a2 2 0 002-2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-200">Add Vehicle</h3>
          <p className="text-sm text-gray-400">Register new vehicle</p>
        </div>
      </div>
    </Link>

    <Link
      href="/service"
      className="bg-gray-900 rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-purple-500"
    >
      <div className="flex items-center gap-4">
        <div className="bg-gray-950 p-3 rounded-lg">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-200">View Services</h3>
          <p className="text-sm text-gray-400">Browse all services</p>
        </div>
      </div>
    </Link>
  </div>
}

export default DashboardActions;