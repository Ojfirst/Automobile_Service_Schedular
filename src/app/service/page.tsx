// import { generateService } from "@/prisma.db";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import ServicePageNavigation from "@/components/Navigations/dashboard-navigation";

type Service = {
  id: string,
  name: string,
  description: string,
  duration: number,
  price: number
}

const ServicePage = async () => {
  const user = await currentUser();


  const resp = await fetch("http://localhost:3000/api/services")

  if (!resp.ok) {
    notFound();
  }
  const services: Service[] = await resp.json();

  // const services: Service[] = await generateService();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ServicePageNavigation />
      {/* Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {services.map((serv) => (
              <div key={serv.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl text-gray-900 font-semibold mb-2">{serv.name}</h2>
                <p className="text-gray-600 mb-4">{serv.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-500">${serv.price}</span>
                  <span className="text-sm text-gray-500">{serv.duration} min</span>
                  <div>
                    {user ? (
                      <Link
                        href={`/book?service=${serv.id}`}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <span>Book Now</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    ) : (
                      <Link
                        href="/sign-up"
                        className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                      >
                        <span>Sign Up to Book</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
            }
            {/* Empty State */}
            {services.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
                  <p className="text-gray-600">Check back later for our service offerings.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


export default ServicePage;