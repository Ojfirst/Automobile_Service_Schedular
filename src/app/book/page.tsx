'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import BookingNavigation from '@/components/booking/navigation'
import Loading from '../_lib/utils/loading'
import SelectService from '@/components/booking/select-service';
import SelectVehicles from '@/components/booking/select-vehicles';
import SelectDateAndTime from '@/components/booking/select-dateAndTime'
import AppointmentConfirmation from '@/components/booking/appointment-confirmation'

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

export interface TimeSlot {
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


          {/* Step 3: Date & Time Selection */}
          <SelectDateAndTime step={step} setStep={setStep} selectedService={selectedService} selectedVehicle={selectedVehicle} selectedDate={selectedDate} handleDateSelect={handleDateSelect} handleTimeSelect={handleTimeSelect} availableSlots={availableSlots} />


          {/* Step 4: Confirmation */}
          <AppointmentConfirmation step={step} setStep={setStep} selectedService={selectedService} selectedVehicle={selectedVehicle} formData={formData} isLoading={isLoading} onSubmit={handleSubmit} />


        </div>
      </main>
    </div>
  )
}