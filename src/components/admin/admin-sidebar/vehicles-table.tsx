'use client'

import { useState } from 'react'
import { Vehicle, User } from '@prisma/client'
import { Car, UserCircle, Calendar, Fuel, Search, Filter, MoreVertical } from 'lucide-react';
import { getMostCommonMake } from '@/app/_lib/utils/getMostCommonMake';

interface VehicleWithUser extends Vehicle {
  owner: User
}

interface VehiclesTableProps {
  vehicles: VehicleWithUser[]
}

export default function VehiclesTable({ vehicles }: VehiclesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMake, setSelectedMake] = useState('all')

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMake = selectedMake === 'all' || vehicle.make === selectedMake

    return matchesSearch && matchesMake
  })

  const makes = Array.from(new Set(vehicles.map(v => v.make)))

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by make, model, or license plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 min-w-[120px]"
          >
            <option value="all">All Makes</option>
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5" />
            More Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Vehicles</p>
          <p className="text-2xl font-bold text-white mt-2">{vehicles.length}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Unique Makes</p>
          <p className="text-2xl font-bold text-white mt-2">{makes.length}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Avg. Vehicle Age</p>
          <p className="text-2xl font-bold text-white mt-2">
            {(() => {
              const currentYear = new Date().getFullYear()
              const avgYear = vehicles.reduce((sum, v) => sum + v.year, 0) / vehicles.length
              return Math.round(currentYear - avgYear)
            })()} years
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Most Common Make</p>
          <p className="text-2xl font-bold text-white mt-2">
            {getMostCommonMake(vehicles)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                <th className="text-left p-4 text-gray-400 font-medium">Vehicle</th>
                <th className="text-left p-4 text-gray-400 font-medium">Details</th>
                <th className="text-left p-4 text-gray-400 font-medium">Registered</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-200 font-medium">{vehicle.owner?.name ?? 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{vehicle.owner?.email ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <Car className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-200 font-medium">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-gray-500">
                          VIN: {vehicle.vin || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Plate:</span>
                        <span className="text-gray-300 font-medium bg-gray-800 px-2 py-1 rounded text-sm">
                          {vehicle.licensePlate || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300 text-sm">{vehicle.fuelType || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300">
                        {new Date(vehicle.createdAt).toISOString().split("T")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                        View History
                      </button>
                      <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Next
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
              <Car className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No vehicles found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try a different search term' : 'No vehicles registered yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}