'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
}

interface Appointment {
  id: string;
  date: Date;
  status: string;
  service: Service;
  vehicle: Vehicle;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/appointments/${appointment.id}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        router.refresh(); // Refresh the page to show updated list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.date);
    const timeDifference = appointmentTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference >= 2 && appointment.status === 'PENDING';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">
            {appointment.service.name}
          </h3>
          <p className="text-gray-400">
            {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">Date & Time</p>
          <p className="font-semibold">
            {new Date(appointment.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-gray-200">
            {new Date(appointment.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Service Details</p>
          <p className="font-semibold text-green-400">${appointment.service.price}</p>
          <p className="text-gray-200">{appointment.service.duration} minutes</p>
        </div>
      </div>

      {/* Action Buttons */}
      {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
        <div className="flex gap-3 pt-4 border-t border-gray-600">
          {canCancel() && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
            </button>
          )}

          <button
            onClick={() => {
              // For now, redirect to booking page with service pre-selected
              // In a real app, you'd implement a proper reschedule flow
              window.location.href = `/book?service=${appointment.service.id}&vehicle=${appointment.vehicle.id}`;
            }}
            className="border border-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            Reschedule
          </button>
        </div>
      )}
    </div>
  );
}