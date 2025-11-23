'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import BookingNavigation from '@/components/booking/navigation'
import Loading from '../_lib/utils/loading'
import SelectService from '@/components/booking/select-service';
import SelectVehicles from '@/components/booking/select-vehicles';

export interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  vin?: string
}

interface TimeSlot {
  time: string
  datetime: string
  displayTime: string
}

export default function BookPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()

  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [formData, setFormData] = useState({
    serviceId: searchParams.get('service') || '',
    vehicleId: searchParams.get('vehicle') || '',
    date: '',
    time: ''
  })

  // Fetch services and vehicles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesResponse = await fetch('/api/services')
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json()
          setServices(servicesData)
        }

        // Fetch user's vehicles
        const vehiclesResponse = await fetch('/api/vehicles')
        if (vehiclesResponse.ok) {
          const vehiclesData = await vehiclesResponse.json()
          setVehicles(vehiclesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate && formData.serviceId) {
      fetchAvailableSlots()
    }
  }, [selectedDate, formData.serviceId,])

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `/api/appointments/available?date=${selectedDate}&serviceId=${formData.serviceId}`
      )
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.availableSlots || [])
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
    }
  }

  const handleServiceSelect = (serviceId: string) => {
    setFormData({ ...formData, serviceId })
    setStep(2)
  }

  const handleVehicleSelect = (vehicleId: string) => {
    setFormData({ ...formData, vehicleId })
    setStep(3)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (datetime: string, time: string) => {
    setFormData({
      ...formData,
      date: datetime,
      time
    })
    setStep(4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          vehicleId: formData.vehicleId,
          date: formData.date
        }),
      })

      if (response.ok) {
        const appointment = await response.json()
        router.push(`/booking/confirmation?id=${appointment.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to book appointment')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Failed to book appointment')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedService = services.find(s => s.id === formData.serviceId)
  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId)

  // Redirect if no user (wait for Clerk to load first)
  if (isLoaded && !user) {
    router.push('/sign-in')
    return null
  }

  // Show loading while Clerk is checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/*Header*/}
        <BookingNavigation />
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <BookingNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= stepNumber
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
                  } font-semibold`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-24 h-1 mx-4 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Service</span>
            <span>Vehicle</span>
            <span>Date & Time</span>
            <span>Confirm</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Service Selection */}
          <SelectService services={services} step={step} onServiceSelect={handleServiceSelect} />


          {/* Step 2: Vehicle Selection */}
          <SelectVehicles vehicles={vehicles} step={step} onVehicleSelect={handleVehicleSelect} setStep={setStep} />
          {step === 2 && (
            <div className="bg-gray-900 rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-300 hover:text-blue-500"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-semibold">Select Vehicle</h2>
              </div>

              {vehicles.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                  <p className="text-gray-600 mb-6">You need to add a vehicle before booking a service.</p>
                  <Link
                    href="/dashboard/vehicles/add"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Add Vehicle
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle.id)}
                      className="text-left p-6 border-2 border-gray-600 rounded-lg hover:border-gray-700 hover:bg-gray-800 transition"
                    >
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        VIN: {vehicle.vin || 'Not provided'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-3300">Select this vehicle</span>
                        <span className="text-blue-300 font-semibold">Select →</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {step === 3 && (
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-300 hover:text-blue-500"
                >
                  ← Back
                </button>
                <h2 className="text-2xl text-gray-300 font-semibold">Select Date & Time</h2>
              </div>

              {/* Selected Service & Vehicle Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Service</h4>
                    <p className="text-gray-800">{selectedService?.name} - ${selectedService?.price}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Vehicle</h4>
                    <p className="text-gray-800">{selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}</p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Available Time Slots
                  </label>
                  {availableSlots.length === 0 ? (
                    <div className="text-center py-8 text-gray-200">
                      No available time slots for this date. Please select another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeSelect(slot.datetime, slot.time)}
                          className="p-4 bg-gray-700 border-2 border-gray-500 rounded-lg hover:border-gray-700 hover:bg-gray-900 transition text-center"
                        >
                          <span className="font-semibold text-gray-300">{slot.displayTime}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="bg-gray-900 rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setStep(3)}
                  className="text-blue-300 hover:text-gray-900"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-semibold">Confirm Appointment</h2>
              </div>

              {/* Appointment Summary */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-400 mb-4">Appointment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Service:</span>
                    <span className="font-semibold">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Vehicle:</span>
                    <span className="font-semibold">
                      {selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Date & Time:</span>
                    <span className="font-semibold">
                      {new Date(formData.date).toLocaleDateString()} at {formData.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Duration:</span>
                    <span className="font-semibold">{selectedService?.duration} minutes</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 mt-3">
                    <span className="text-gray-100">Total:</span>
                    <span className="text-xl font-bold text-green-500">${selectedService?.price}</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Any special requests or information about your vehicle..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}