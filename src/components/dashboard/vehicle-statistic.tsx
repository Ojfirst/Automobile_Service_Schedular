import { prisma } from "@/prisma.db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



const VehicleStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulate delay
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in')
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
    where: { clerkUserId: user.id },
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
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            <p className="text-sm text-gray-600">Vehicles</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            <p className="text-sm text-gray-600">Upcoming Appointments</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">Support Available</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleStats;