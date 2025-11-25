'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppointmentCard from './appointmentCard';

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

interface AppointmentListProps {
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  cancelledAppointments: Appointment[];
}

export default function AppointmentList({
  upcomingAppointments,
  pastAppointments,
  cancelledAppointments
}: AppointmentListProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  const getAppointmentsByTab = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingAppointments;
      case 'past':
        return pastAppointments;
      case 'cancelled':
        return cancelledAppointments;
      default:
        return upcomingAppointments;
    }
  };

  const appointments = getAppointmentsByTab();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Past ({pastAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'cancelled'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Cancelled ({cancelledAppointments.length})
            </button>
          </nav>
        </div>

        {/* Appointment Cards */}
        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'upcoming' && 'No upcoming appointments'}
                {activeTab === 'past' && 'No past appointments'}
                {activeTab === 'cancelled' && 'No cancelled appointments'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'upcoming' && 'Schedule your first service appointment to get started.'}
                {activeTab === 'past' && 'Your completed appointments will appear here.'}
                {activeTab === 'cancelled' && 'Your cancelled appointments will appear here.'}
              </p>
              {activeTab === 'upcoming' && (
                <Link
                  href="/services"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Book Service
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}