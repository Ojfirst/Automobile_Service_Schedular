import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/prisma.db'
import InventoryDashboard from '@/components/admin/inventory-dashboard'
import InventoryStats from '@/components/admin/dashboard-stats';
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Inventory Management - AutoCare Pro',
  description: 'Manage spare parts, track stock levels, and monitor inventory value',
}

async function getInventoryData() {
  try {
    const [parts, lowStockParts, recentTransactions, suppliers] = await Promise.all([
      prisma.part.findMany({
        include: {
          supplier: true,
          _count: {
            select: {
              transactions: true,
              services: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),

      prisma.part.findMany({
        where: {
          stock: {
            lte: prisma.part.fields.minStock
          }
        },
        include: {
          supplier: true,
        },
        orderBy: { stock: 'asc' },
        take: 10,
      }),

      prisma.inventoryTransaction.findMany({
        include: {
          part: {
            include: {
              supplier: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),

      prisma.supplier.findMany({
        orderBy: { name: 'asc' },
      }),
    ])

    return {
      parts,
      lowStockParts,
      recentTransactions,
      suppliers
    }
  } catch (error) {
    console.error('Error fetching inventory data:', error)
    // Return empty arrays as fallback
    return {
      parts: [],
      lowStockParts: [],
      recentTransactions: [],
      suppliers: []
    }
  }
}

function LoadingInventory() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default async function InventoryPage() {
  const user = await currentUser()

  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/sign-in')
  }

  const data = await getInventoryData()

  // Calculate inventory statistics
  const inventoryValue = data.parts.reduce((sum, part) => sum + (part.stock * part.cost), 0)
  const retailValue = data.parts.reduce((sum, part) => sum + (part.stock * part.price), 0)
  const totalParts = data.parts.length
  const outOfStock = data.parts.filter(p => p.stock === 0).length
  const lowStock = data.lowStockParts.length

  const stats = {
    inventoryValue,
    retailValue,
    totalParts,
    outOfStock,
    lowStock,
    totalSuppliers: data.suppliers.length,
    potentialProfit: retailValue - inventoryValue,
    avgMargin: retailValue > 0 ? ((retailValue - inventoryValue) / retailValue) * 100 : 0,
  }

  return (
    <main className="flex-1 p-6 lg:p-8 bg-black">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-200">Inventory Management</h1>
            <p className="text-gray-400 mt-2">
              Manage spare parts, track stock levels, and monitor inventory value
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-400">Last Updated</p>
              <p className="text-gray-300 font-medium">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suspense boundary for better loading experience */}
      <Suspense fallback={<LoadingInventory />}>
        <InventoryStats stats={stats} />
        <InventoryDashboard
          parts={data.parts}
          lowStockParts={data.lowStockParts}
          recentTransactions={data.recentTransactions}
          suppliers={data.suppliers}
          stats={stats}
        />
      </Suspense>
    </main>
  )
}