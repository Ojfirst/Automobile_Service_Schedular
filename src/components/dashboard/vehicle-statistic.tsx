import { prisma } from "@/prisma.db";
import type { User } from "@clerk/nextjs/server";

const VehicleStats = async ({ user }: { user: User | null }) => {

  // Guard: user must exist
  if (!user) {
    return (
      <div className="mt-8 text-center text-gray-400">
        User information not available
      </div>
    );
  }

  // Find or create user in our database
  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim()
      }
    })
  }

  // Fetch user's vehicles
  const vehicles = await prisma.vehicle.findMany({
    where: { ownerId: dbUser.id },
    orderBy: { createdAt: 'desc' }
  })

  // Fetch user's upcoming appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      userId: dbUser.id,
      date: {
        gte: new Date() // Only future appointments
      }
    },
    include: {
      service: true,
      vehicle: true
    },
    orderBy: { date: 'asc' },
    take: 5 // Limit to 5 upcoming appointments
  })

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Vehicles Card */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Vehicles</p>
            <p className="text-3xl font-bold text-white mt-2">{vehicles.length}</p>
            <div className="flex items-center gap-2 mt-4">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-green-400 text-sm">Recently added</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Appointments Card */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Upcoming Appointments</p>
            <p className="text-3xl font-bold text-white mt-2">{appointments.length}</p>
            <div className="flex items-center gap-2 mt-4">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-blue-400 text-sm">Scheduled</span>
            </div>
          </div>
          <div className="p-3 bg-green-500/20 rounded-xl">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Support Card */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Support Available</p>
            <p className="text-3xl font-bold text-white mt-2">24/7</p>
            <div className="flex items-center gap-2 mt-4">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-purple-400 text-sm">Always online</span>
            </div>
          </div>
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleStats;