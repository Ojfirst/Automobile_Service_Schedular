

const ProgressSteps = ({ step }: { step: number }) => {

  return (
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
  )
}

export default ProgressSteps;
