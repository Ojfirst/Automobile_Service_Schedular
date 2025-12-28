import Link from "next/link"
import { getOrCreateUser } from "@/app/_lib/auth/admin-auth";

const ServicePageNavigation = async () => {
  const { user } = await getOrCreateUser();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
          ) : (
            ''
          )}
        </div>
      </div>
    </header>
  )
}

export default ServicePageNavigation;

