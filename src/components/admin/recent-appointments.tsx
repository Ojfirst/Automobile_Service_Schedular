"use client"

import { useState } from 'react'
import type { ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical, CheckCircle, XCircle, Clock, Wrench } from 'lucide-react'
import { toast } from 'sonner'

interface Appointment {
  id: string
  date: string
  status: string
  service: {
    name: string
    price: number
  }
  vehicle: {
    make: string
    model: string
    year: number
  }
  user: {
    name: string | null
    email: string
  }
}

interface RecentAppointmentsProps {
  appointments: Appointment[]
}

const statusConfig = {
  PENDING: { color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  CONFIRMED: { color: 'bg-blue-500/20 text-blue-400', icon: CheckCircle },
  IN_PROGRESS: { color: 'bg-emerald-500/20 text-emerald-400', icon: Wrench },
  COMPLETED: { color: 'bg-gray-500/20 text-gray-400', icon: CheckCircle },
  CANCELLED: { color: 'bg-rose-500/20 text-rose-400', icon: XCircle },
}

function getStatusConfig(status: string) {
  return (statusConfig as Record<string, { color: string; icon: ComponentType<Record<string, unknown>> }>)[status] ?? statusConfig.PENDING
}

export default function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  const filteredAppointments = selectedStatus === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === selectedStatus)

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Appointment status updated');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast.error('Appointment status update failed');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent Appointments</h2>
          <p className="text-sm text-gray-400">Manage all customer appointments</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            {Object.keys(statusConfig).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Service</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Vehicle</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date & Time</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => {
              const cfg = getStatusConfig(appointment.status)
              const StatusIcon = cfg.icon

              return (
                <tr
                  key={appointment.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-white">{appointment.user.name}</p>
                      <p className="text-sm text-gray-400">{appointment.user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-white">{appointment.service.name}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-white">
                      {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-white">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(appointment.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-white font-semibold">${appointment.service.price.toFixed(2)}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusUpdate(appointment.id, e.target.value as Appointment['status'])}
                        disabled={isUpdating}
                        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {Object.keys(statusConfig).map(status => (
                          <option key={status} value={status}>{isUpdating ? 'Updating...' : status}</option>
                        ))}
                      </select>
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">📭</div>
            <p className="text-gray-400">No appointments found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </p>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors" onClick={() => setSelectedStatus('all')}>
          View All Appointments
        </button>
      </div>
    </div>
  )
}