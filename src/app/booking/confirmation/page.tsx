import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/prisma.db'
import { currentUser } from '@clerk/nextjs/server'

interface PageProps {
  // Next may pass `searchParams` as a plain object or a Promise depending on rendering.
  searchParams: Promise<{ id?: string } | Record<string, string>> | { id?: string } | Record<string, string>
}

export default async function ConfirmationPage(props: PageProps) {
  // `searchParams` can be a Promise — await it safely.
  const searchParams = (await props.searchParams) as { id?: string }

  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  if (!searchParams?.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-2xl font-bold mb-4">No appointment specified</h1>
              <p className="text-gray-600 mb-6">We could not find an appointment id in the URL. If you just booked, the confirmation link should include the appointment id. You can return to your dashboard or try booking again.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg">View Dashboard</Link>
                <Link href="/book" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg">Book Again</Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Fetch appointment details
  const appointment = await prisma.appointment.findUnique({
    where: { id: searchParams.id! },
    include: {
      service: true,
      vehicle: true
    }
  })

  if (!appointment) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 shadow">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-400 mb-4">Appointment Confirmed!</h1>
            <p className="text-gray-200 mb-8">
              Your service appointment has been scheduled successfully. We look forward to serving you!
            </p>

            {/* Appointment Details */}
            <div className="bg-gray-950 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold text-gray-400 mb-4">Appointment Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-semibold text-gray-200">{appointment.service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle:</span>
                  <span className="font-semibold text-gray-200">
                    {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time:</span>
                  <span className="font-semibold text-gray-200">
                    {new Date(appointment.date).toLocaleDateString()} at {' '}
                    {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-semibold text-gray-200">{appointment.service.duration} minutes</span>
                </div>
                <div className="flex justify-between border-t pt-3 mt-3">
                  <span className="text-gray-500">Total:</span>
                  <span className="text-xl font-bold text-green-500">${appointment.service.price}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-400 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What is Next?</h3>
              <ul className="space-y-2 text-black">
                <li>• You will receive a confirmation email shortly</li>
                <li>• Please arrive 10 minutes before your appointment</li>
                <li>• Bring your vehicle registration and insurance documents</li>
                <li>• Contact us if you need to reschedule</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                View Dashboard
              </Link>
              <Link
                href="/services"
                className="border border-gray-300 text-gray-400 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 hover:text-gray-900 transition"
              >
                Book Another Service
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}