import { prisma } from "@/prisma.db";

import Link from "next/link";

const VehiclesDB = async ({ userId }: { userId: string }) => {

  const vehicles = await prisma.vehicle.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No vehicles yet</h3>
          <p className="text-gray-500 mb-6">Add your first vehicle to get started with service appointments.</p>
          <Link
            href="/dashboard/vehicles/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Vehicle
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-800 rounded-xl hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    {vehicle.vin && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">VIN:</span>
                        <span className="text-xs text-gray-400 font-mono">{vehicle.vin}</span>
                      </div>
                    )}
                    {vehicle.color && (
                      <>
                        <span className="text-gray-600">•</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Color:</span>
                          <span className="text-xs text-gray-400">{vehicle.color}</span>
                        </div>
                      </>
                    )}
                  </div>
                  {vehicle.licensePlate && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-medium">
                        Plate: {vehicle.licensePlate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/book?vehicle=${vehicle.id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Service
                </Link>
                <Link
                  href={`/dashboard/vehicles/${vehicle.id}`}
                  className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors"
                  title="View Details"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

}


export default VehiclesDB;