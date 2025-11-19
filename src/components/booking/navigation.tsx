import Link from "next/link"




const BookingNavigation = () => {
  return (
    <header className="bg-gray-900 shadow">
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-700 hover:text-blue-500 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-blue-200">Schedule Service Appointment</h1>
        <p className="text-gray-300 mt-2">Schedule your vehicle service in a few easy steps</p>
      </div>
    </header>
  )
}

export default BookingNavigation;