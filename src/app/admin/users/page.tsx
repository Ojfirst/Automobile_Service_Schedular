import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/prisma.db';
import AdminHeader from '@/components/admin/admin-header';
import AdminSidebar from '@/components/admin/admin-sidebar';
import UsersTable from '@/components/admin/admin-sidebar/users-table';
import { Prisma } from '@prisma/client';

type Props = {
  searchParams?: { q?: string } | Record<string, string>
}

export default async function UsersPage({ searchParams }: Props) {
  const user = await currentUser()

  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/sign-in')
  }

  const q = (searchParams as { q?: string } | undefined)?.q?.trim() ?? ''

  const where: Prisma.UserWhereInput | undefined = q
    ? {
      OR: [
        { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
      ],
    }
    : undefined

  const users = await prisma.user.findMany({
    where,
    include: {
      _count: {
        select: {
          appointments: true,
          vehicles: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-black">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">Users</h1>
            <p className="text-gray-400 mt-2">Manage customer accounts and permissions</p>
          </div>
          <UsersTable users={users} initialQuery={q} />
        </main>
      </div>
    </div>
  )
}