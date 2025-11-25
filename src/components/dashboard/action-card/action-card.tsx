
import { prisma } from "@/prisma.db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const user = await currentUser();

if (!user) {
  redirect('/sign-in')
}
const vehicles = await prisma.vehicle.findMany({
  where: { clerkUserId: user.id },
  orderBy: { createdAt: 'desc' }
})

if (vehicles.length === 0) {
  redirect('/dashboard/vehicles/add')
}
const vehicle = vehicles[0];
export const actionCards = [
  {
    href: `/book?vehicle=${vehicle.id}`,
    title: "Book Service",
    description: "Book appointment",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    gradientFrom: "from-blue-500",
    gradientTo: "to-purple-600",
    hoverColor: "blue",
    pulseColor: "bg-blue-500",
    progressColor: "bg-blue-500",
    hoverProgressColor: "bg-blue-400"
  },
  {
    href: "/dashboard/vehicles/add",
    title: "Add Vehicle",
    description: "Register new vehicle",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2m0 0a2 2 0 002 2h14a2 2 0 002-2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      </svg>
    ),
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-600",
    hoverColor: "green",
    pulseColor: "bg-green-500",
    progressColor: "bg-green-500",
    hoverProgressColor: "bg-green-400"
  },
  {
    href: "/service",
    title: "View Services",
    description: "Browse all services",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-600",
    hoverColor: "purple",
    pulseColor: "bg-purple-500",
    progressColor: "bg-purple-500",
    hoverProgressColor: "bg-purple-400"
  },
  {
    href: "/dashboard/appointments",
    title: "Appointments",
    description: "Manage appointments",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
    hoverColor: "orange",
    pulseColor: "bg-orange-500",
    progressColor: "bg-orange-500",
    hoverProgressColor: "bg-orange-400"
  }
];