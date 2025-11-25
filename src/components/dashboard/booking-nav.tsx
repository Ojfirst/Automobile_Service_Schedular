import Link from "next/link";


const BookingNav = () => {


  return (
    <Link
      href="/dashboard/appointments"
      className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-center gap-4">
        {/* Modern Icon Container */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {/* Pulse animation effect */}
          <div className="absolute inset-0 w-12 h-12 bg-orange-500 rounded-xl animate-ping opacity-20 group-hover:opacity-30"></div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg group-hover:text-orange-300 transition-colors">
            Manage Appointments
          </h3>
          <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
            View, cancel, or reschedule your service appointments
          </p>

          {/* Subtle progress indicator */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="w-8 h-1 bg-orange-500 rounded-full group-hover:bg-orange-400 group-hover:w-12 transition-all duration-500"></div>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gray-400">Quick access</span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="text-gray-500 group-hover:text-orange-400 transition-colors transform group-hover:translate-x-1 duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default BookingNav;