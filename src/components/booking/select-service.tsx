import type { Service } from "@/components/booking/booking-page";

const SelectService = (
  { services, step, onServiceSelect }:
    {
      services: Service[], step: number,
      onServiceSelect: (id: string) => void
    }) => {

  return (
    <>
      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="bg-gray-900 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Select Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service.id)}
                className="text-left p-6 border-3 border-gray-600 shadow-2xl rounded-lg hover:border-gray-700 hover:bg-gray-800 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-400">{service.name}</h3>
                  <span className="bg-blue-800 text-blue-100 text-sm font-semibold px-2 py-1 rounded">
                    {service.duration} min
                  </span>
                </div>
                <p className="text-gray-200 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-100">${service.price}</span>
                  <span className="text-blue-300 font-semibold">Select →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default SelectService;