import type { Service, Vehicle, TimeSlot } from "@/app/book/page";

const SelectDateAndTime = (
  {
    step, setStep, selectedService, selectedVehicle, selectedDate, handleDateSelect, handleTimeSelect, availableSlots
  }: {
    step: number,
    setStep: (step: number) => void,
    selectedService: Service | undefined,
    selectedVehicle: Vehicle | undefined,
    selectedDate: string,
    handleDateSelect: (date: string) => void,
    handleTimeSelect: (datetime: string, time: string) => void,
    availableSlots: TimeSlot[]
  }
) => {


  return (
    <>
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
    </>
  )
}

export default SelectDateAndTime;