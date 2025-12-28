// import { generateService } from "@/prisma.db";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import Services from "@/components/services/services";
import ServicePageNavigation from "@/components/Navigations/dashboard-navigation";
import Loading from "../dashboard/loading";



const ServicePage = async () => {
  const user = await currentUser();


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ServicePageNavigation />
      {/* Content */}
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<Loading />}>
          <Services user={user!} />
        </Suspense>
      </div>
    </div>
  )
}


export default ServicePage;