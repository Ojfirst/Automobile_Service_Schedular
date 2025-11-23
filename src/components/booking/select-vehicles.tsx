"use client"

import Link from "next/link";
import type { Vehicle } from "@/app/book/page";
import React from "react";

type Props = {
  vehicles: Vehicle[]
  step: number
  setStep: (step: number) => void
  onVehicleSelect: (vehicleId: string) => void
}

const SelectVehicles = ({ vehicles, step, setStep, onVehicleSelect }: Props) => {


  return (
    <>
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
                  onClick={() => onVehicleSelect(vehicle.id)}
                  className="text-left p-6 border-2 border-gray-600 rounded-lg hover:border-gray-700 hover:bg-gray-800 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    VIN: {vehicle.vin || 'Not provided'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Select this vehicle</span>
                    <span className="text-blue-300 font-semibold">Select →</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default SelectVehicles;