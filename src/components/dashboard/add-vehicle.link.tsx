import Link from "next/link";


const AddVehcileLink = () => {


  return (
    <div className="px-6 py-4 border-b border-gray-700">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-400">My Vehicles</h2>
        <Link
          href="/dashboard/vehicles/add"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Vehicle
        </Link>
      </div>
    </div>
  )
}

export default AddVehcileLink;