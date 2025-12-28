'use client'

import { Appointment, Service, User, Vehicle } from '@prisma/client'
import { Calendar, Clock, UserCircle, Car, Wrench } from 'lucide-react'

interface AppointmentWithDetails extends Appointment {
  service: Service
  vehicle: Vehicle
  user: User
}

interface AppointmentsTableProps {
  appointments: AppointmentWithDetails[]
}

export default function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-400'
      case 'CONFIRMED': return 'bg-blue-500/10 text-blue-400'
      case 'IN_PROGRESS': return 'bg-purple-500/10 text-purple-400'
      case 'COMPLETED': return 'bg-green-500/10 text-green-400'
      case 'CANCELLED': return 'bg-red-500/10 text-red-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-200">
            All Appointments ({appointments.length})
          </h2>
          <div className="flex gap-2">
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="date"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
              <th className="text-left p-4 text-gray-400 font-medium">Service</th>
              <th className="text-left p-4 text-gray-400 font-medium">Vehicle</th>
              <th className="text-left p-4 text-gray-400 font-medium">Date & Time</th>
              <th className="text-left p-4 text-gray-400 font-medium">Status</th>
              <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{appointment.user.name}</p>
                      <p className="text-sm text-gray-500">{appointment.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">{appointment.service.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">${appointment.service.price}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">
                      {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{
                      new Date(appointment.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                      View
                    </button>
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-800 flex justify-between items-center">
        <p className="text-gray-500 text-sm">
          Showing {appointments.length} of {appointments.length} appointments
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}