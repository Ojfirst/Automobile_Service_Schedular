import { prisma } from '@/prisma.db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import HeaderSection from '@/components/appointments/header';
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
      <HeaderSection />

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