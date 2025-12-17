import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/prisma.db'
import InventoryDashboard from '@/components/admin/inventory-dashboard'

export default async function InventoryPage() {
  const user = await currentUser()

  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/sign-in')
  }

  // Fetch all data in parallel for better performance
  const [parts, lowStockParts, recentTransactions, suppliers, categories] = await Promise.all([
    // Get all parts with supplier info and counts
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

    // Get low stock parts (stock <= minStock)
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

    // Get recent inventory transactions
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

    // Get all suppliers for reference
    prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    }),

    // Get unique categories for filters
    prisma.part.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    }),
  ])

  // Calculate inventory statistics
  const inventoryValue = parts.reduce((sum, part) => sum + (part.stock * part.cost), 0)
  const retailValue = parts.reduce((sum, part) => sum + (part.stock * part.price), 0)
  const totalParts = parts.length
  const outOfStock = parts.filter(p => p.stock === 0).length
  const lowStock = lowStockParts.length

  // Calculate category distribution
  const categoryDistribution = parts.reduce((acc, part) => {
    if (!acc[part.category]) {
      acc[part.category] = {
        count: 0,
        value: 0,
        items: 0,
      }
    }
    acc[part.category].count += 1
    acc[part.category].value += part.stock * part.cost
    acc[part.category].items += part.stock
    return acc
  }, {} as Record<string, { count: number; value: number; items: number }>)

  // Prepare data for the dashboard
  const stats = {
    inventoryValue,
    retailValue,
    totalParts,
    outOfStock,
    lowStock,
    totalSuppliers: suppliers.length,
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
                  weekday: 'short',
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

      {/* Inventory Dashboard Component */}
      <InventoryDashboard
        parts={parts}
        lowStockParts={lowStockParts}
        recentTransactions={recentTransactions}
        stats={stats}
      />

      {/* Additional Information Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Summary */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Category Summary</h3>
          <div className="space-y-4">
            {Object.entries(categoryDistribution)
              .sort(([, a], [, b]) => b.value - a.value)
              .slice(0, 6)
              .map(([category, data]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-300 font-medium">
                        {category.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{category}</p>
                      <p className="text-sm text-gray-500">
                        {data.count} SKU{data.count !== 1 ? 's' : ''} • {data.items} unit{data.items !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 font-medium">
                      ${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">Inventory Value</p>
                  </div>
                </div>
              ))}
            {Object.keys(categoryDistribution).length > 6 && (
              <div className="text-center pt-2">
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View All {Object.keys(categoryDistribution).length} Categories →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${transaction.type === 'PURCHASE' ? 'bg-green-500/20' :
                      transaction.type === 'SALE' ? 'bg-blue-500/20' :
                        transaction.type === 'ADJUSTMENT' ? 'bg-yellow-500/20' :
                          'bg-red-500/20'
                    }`}>
                    <span className={`text-xs font-medium ${transaction.type === 'PURCHASE' ? 'text-green-400' :
                        transaction.type === 'SALE' ? 'text-blue-400' :
                          transaction.type === 'ADJUSTMENT' ? 'text-yellow-400' :
                            'text-red-400'
                      }`}>
                      {transaction.type.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 font-medium truncate">
                      {transaction.part.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${transaction.type === 'PURCHASE' ? 'text-green-400' :
                          transaction.type === 'SALE' ? 'text-blue-400' :
                            transaction.type === 'ADJUSTMENT' ? 'text-yellow-400' :
                              'text-red-400'
                        }`}>
                        {transaction.type}
                      </span>
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-gray-500 text-xs">
                        Qty: {transaction.quantity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.type === 'PURCHASE' ? 'text-green-400' :
                      transaction.type === 'SALE' ? 'text-blue-400' : 'text-gray-300'
                    }`}>
                    {transaction.type === 'PURCHASE' ? '-' : '+'}${transaction.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
            {recentTransactions.length > 5 && (
              <div className="text-center pt-2">
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View All Activity →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supplier Quick View */}
      {suppliers.length > 0 && (
        <div className="mt-8 bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Suppliers</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Manage Suppliers →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suppliers.slice(0, 4).map((supplier) => {
              const supplierParts = parts.filter(p => p.supplierId === supplier.id)
              const supplierValue = supplierParts.reduce((sum, part) => sum + (part.stock * part.cost), 0)

              return (
                <div key={supplier.id} className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-300 font-medium">
                        {supplier.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {supplierParts.length} part{supplierParts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h4 className="text-gray-200 font-medium truncate">{supplier.name}</h4>
                  {supplier.contactName && (
                    <p className="text-sm text-gray-500 mt-1">{supplier.contactName}</p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-sm text-gray-400">Inventory Value</p>
                    <p className="text-gray-300 font-medium">
                      ${supplierValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}