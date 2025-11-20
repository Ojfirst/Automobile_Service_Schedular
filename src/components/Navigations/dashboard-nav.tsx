import { currentUser } from "@clerk/nextjs/server";

const DashBardNav = async () => {
  const user = await currentUser();

  return <header className="bg-gray-900 shadow">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-200">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.firstName}</p>
      </div>
    </div>
  </header>
}

export default DashBardNav;