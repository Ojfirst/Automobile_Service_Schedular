'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';;
import { vehicleFuelTypes, carBrands, vehicleColors, vehicleTransmissions } from './vehicle-items';
import { toast } from 'sonner';


export default function AddVehiclePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    fuelType: '',
    licensePlate: '',
    color: '',
    transmission: '',
    mileage: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true);

    console.log(formData);
    try {
      // coerce mileage to a number (or null) before sending
      const payload = {
        ...formData,
        mileage:
          formData.mileage === '' || formData.mileage === null
            ? null
            : Number(formData.mileage),
      }

      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success('Vehicle added successfully!');
        router.push('/dashboard');
        router.refresh();

      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add vehicle')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        console.error('Error adding vehicle:', error)
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Generate year options (last 30 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-200">Add Vehicle</h1>
          <p className="text-gray-400 mt-2">Add your vehicle to book service appointments</p>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-gray-900/50 rounded-2xl border border-gray-800 shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Make */}
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-400 mb-2">
                  Make *
                </label>
                <select
                  name='make'
                  id="make"
                  value={formData.make}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                >
                  <option value='' className="text-gray-500">Select a make</option>
                  {carBrands.map((brand) => (
                    <option key={brand} value={brand} className="text-gray-300">
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-400 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                  placeholder="e.g., Camry, Civic, F-150"
                />
              </div>

              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-400 mb-2">
                  Year *
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                >
                  <option value="" className="text-gray-500">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year} className="text-gray-300">{year}</option>
                  ))}
                </select>
              </div>

              {/* VIN */}
              <div>
                <label htmlFor="vin" className="block text-sm font-medium text-gray-400 mb-2">
                  VIN (Optional)
                </label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                  placeholder="Vehicle Identification Number"
                />
              </div>

              {/* Transmission */}
              <div>
                <label htmlFor="transmission" className="block text-sm font-medium text-gray-400 mb-2">
                  Transmission (Optional)
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                >
                  <option value="" className="text-gray-500">Select Transmission</option>
                  {vehicleTransmissions.map((trans) => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label htmlFor="fuelType" className="block text-sm font-medium text-gray-400 mb-2">
                  Fuel Type (Optional)
                </label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                >
                  <option value="" className="text-gray-500">Select Fuel Type</option>
                  {vehicleFuelTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}

                </select>
              </div>

              {/* Mileage */}
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-400 mb-2">
                  Mileage (Optional)
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  min={0}
                  step={1}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                  placeholder="e.g., 120000"
                />
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-400 mb-2">
                  Color (Optional)
                </label>
                <select
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                >
                  <option value="" className="text-gray-500">Select Color</option>
                  {vehicleColors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* License Plate */}
              <div className="md:col-span-2">
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-400 mb-2">
                  License Plate (Optional)
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                  placeholder="e.g., ABC-123"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4 pt-6 border-t border-gray-800">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Vehicle...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Vehicle
                  </>
                )}
              </button>

              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}