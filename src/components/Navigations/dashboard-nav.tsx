import { currentUser } from "@clerk/nextjs/server";

const DashBardNav = async () => {
  const user = await currentUser();

  return <header className="bg-gray-900 shadow">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-200">Dashboard</h1>
        <p className="text-blue-400 text-sm">Welcome back, <span className="text-purple-500">{user?.firstName}</span></p>
      </div>
    </div>
  </header>
}

export default DashBardNav;