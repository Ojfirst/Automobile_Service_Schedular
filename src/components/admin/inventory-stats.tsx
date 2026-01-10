'use client'

import { DollarSign, Package, AlertTriangle, TrendingUp, Building } from 'lucide-react'
import { InventoryStatsProps } from '../../../types/inventory'


export default function InventoryStats({ stats }: InventoryStatsProps) {
  // Safe defaults for all stats
  const safeStats = {
    inventoryValue: stats?.inventoryValue ?? 0,
    retailValue: stats?.retailValue ?? 0,
    totalParts: stats?.totalParts ?? 0,
    outOfStock: stats?.outOfStock ?? 0,
    lowStock: stats?.lowStock ?? 0,
    totalSuppliers: stats?.totalSuppliers ?? 0,
    potentialProfit: stats?.potentialProfit ?? 0,
    avgMargin: stats?.avgMargin ?? 0,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Inventory Value</p>
            <p className="text-2xl font-bold text-white mt-2">
              ${safeStats.inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <DollarSign className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">+12.5% from last month</span>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Parts</p>
            <p className="text-2xl font-bold text-white mt-2">{safeStats.totalParts}</p>
          </div>
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Package className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">+8.2% from last month</span>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Low Stock Items</p>
            <p className="text-2xl font-bold text-white mt-2">{safeStats.lowStock}</p>
          </div>
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          {safeStats.outOfStock > 0 ? (
            <>
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{safeStats.outOfStock} out of stock</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">All items in stock</span>
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Potential Profit</p>
            <p className="text-2xl font-bold text-white mt-2">
              ${safeStats.potentialProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Building className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">Avg. Margin: {safeStats.avgMargin.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}