import React from 'react'
import type { Service, Vehicle } from '@/components/booking/booking-page'

const AppointmentConfirmation = (
  {
    step,
    setStep,
    selectedService,
    selectedVehicle,
    formData,
    isLoading,
    onSubmit
  }: {
    step: number,
    setStep: (step: number) => void,
    selectedService: Service | undefined,
    selectedVehicle: Vehicle | undefined,
    formData: { serviceId?: string; vehicleId?: string; date: string; time: string; notes?: string },
    isLoading: boolean,
    onSubmit: (e: React.FormEvent) => void
  }
) => {


  return (
    <>
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
          <form onSubmit={onSubmit}>
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
    </>
  )
}

export default AppointmentConfirmation;