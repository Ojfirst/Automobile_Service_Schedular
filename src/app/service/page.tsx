import { generateService } from "@/prisma.db";

type Service = {
  id: string,
  name: string,
  description: string,
  duration: number,
  price: number
}

const ServicePage = async () => {

  const resp = await fetch("http://localhost:3000/api", {
    cache: 'no-store'
  })

  const services: Service[] = await resp.json();

  // const services: Service[] = await generateService();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            services.map((serv) => (

              <div key={serv.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl text-gray-900 font-semibold mb-2">{serv.name}</h2>
                <p className="text-gray-600 mb-4">{serv.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-500">${serv.price}</span>
                  <span className="text-sm text-gray-500">{serv.duration} min</span>
                </div>
              </div>
            ))

          }
          {/* Add more service cards as needed */}
        </div>
      </div>
    </div>
  )
}


export default ServicePage;