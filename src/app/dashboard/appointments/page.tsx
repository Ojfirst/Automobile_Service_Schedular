import { prisma } from '@/prisma.db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AppointmentList from '@/components/appointments/appointmentList';

export default async function AppointmentsPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Find user in database
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id }
  });

  if (!dbUser) {
    redirect('/dashboard');
  }

  // Fetch user's appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      userId: dbUser.id
    },
    include: {
      service: true,
      vehicle: true
    },
    orderBy: {
      date: 'asc'
    }
  });

  // Separate appointments by status
  const upcomingAppointments = appointments.filter(apt =>
    new Date(apt.date) >= new Date() &&
    apt.status !== 'CANCELLED' &&
    apt.status !== 'COMPLETED'
  );

  const pastAppointments = appointments.filter(apt =>
    new Date(apt.date) < new Date() ||
    apt.status === 'COMPLETED'
  );

  const cancelledAppointments = appointments.filter(apt =>
    apt.status === 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
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
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600">Manage your service appointments</p>
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

      <main className="container mx-auto px-4 py-8">
        <AppointmentList
          upcomingAppointments={upcomingAppointments}
          pastAppointments={pastAppointments}
          cancelledAppointments={cancelledAppointments}
        />
      </main>
    </div>
  );
}