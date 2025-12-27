import { Suspense } from 'react'
import AdminSidebar from '@/components/admin/admin-sidebar';
import InventoryDashboard from '@/components/admin/inventory-dashboard'
import InventoryStats from '@/components/admin/inventory-stats';
import { LoadingInventory } from '@/app/_lib/utils/loadingInventory';
import { getInventoryData } from '@/app/_lib/utils/get-inventry-data';
import { requireAdminAuth } from '@/app/_lib/auth/admin-auth';

export const metadata = {
  title: 'Inventory Management - AutoCare Pro',
  description: 'Manage spare parts, track stock levels, and monitor inventory value',
}

export default async function InventoryPage() {
  await requireAdminAuth()

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
    <div className="min-h-screen flex">
      <AdminSidebar />
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
    </div>
  )
}