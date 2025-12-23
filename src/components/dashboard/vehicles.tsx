import { prisma } from "@/prisma.db";

import Link from "next/link";

const VehiclesDB = async ({ userId }: { userId: string }) => {

  const vehicles = await prisma.vehicle.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' }
  })

  return <div className="p-6 bg-gray-900">
    {vehicles.length === 0 ? (
      <div className="text-center py-8">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-400 mb-2">No vehicles yet</h3>
        <p className="text-gray-200 mb-4">Add your first vehicle to get started with service appointments.</p>
        <Link
          href="/dashboard/vehicles/add"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
        >
          Add Your First Vehicle
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    ) : (
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center justify-between bg-gray-950 p-4 border border-gray-800 rounded-lg hover:bg-gray-800 transition">
            <div>
              <h3 className="font-semibold text-gray-200">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
              <p className="text-sm text-gray-400">
                VIN: {vehicle.vin || 'Not provided'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/book?vehicle=${vehicle.id}`}
                className="text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                Book Service
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

}


export default VehiclesDB;