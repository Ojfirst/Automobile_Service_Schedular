import { prisma } from "@/prisma.db";
import type { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Appointments = async ({ user }: { user: Awaited<ReturnType<typeof currentUser>> }) => {

  if (!user) {
    redirect('/sign-in');
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id }
  })

  const appointments = await prisma.appointment.findMany({
    where: { userId: dbUser?.id, date: { gte: new Date() } },
    include: {
      service: true,
      vehicle: true
    },
    orderBy: { date: 'asc' },
    take: 5
  })




  return (
    <div className="bg-gray-900 rounded-lg shadow">
      <div className="px-6 py-4 rounded-t-2xl border-b bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-gray-400">Upcoming Appointments</h2>
      </div>

      <div className="p-6">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
            <p className="text-gray-600">Schedule your first service appointment to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border bg-gray-950 border-gray-800 rounded-lg hover:bg-gray-800 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-200">{appointment.service.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(appointment.date).toLocaleDateString()} at {' '}
                  {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm font-semibold text-green-500 mt-2">
                  ${appointment.service.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  )
}

export default Appointments;