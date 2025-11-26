import Link from "next/link"

const HeaderSection = () => {

  return (
    <header className="bg-gray-900 shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-200">My Appointments</h1>
            <p className="text-gray-400">Manage your service appointments</p>
          </div>
          <Link
            href="/services"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Book New Service
          </Link>
        </div>
      </div>
    </header>
  )
}

export default HeaderSection;