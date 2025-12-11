import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/prisma.db';
import AdminHeader from '@/components/admin/admin-header';
import AdminSidebar from '@/components/admin/admin-sidebar';
import UsersTable from '@/components/admin/admin-sidebar/users-table';

export default async function UsersPage() {
  const user = await currentUser()

  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/sign-in')
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          appointments: true,
          vehicles: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-black">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">Users</h1>
            <p className="text-gray-400 mt-2">
              Manage customer accounts and permissions
            </p>
          </div>
          <UsersTable users={users} />
        </main>
      </div>
    </div>
  )
}