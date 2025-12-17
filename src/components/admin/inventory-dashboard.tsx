'use client'

import { useState } from 'react'
import { Part, Supplier, InventoryTransaction } from '@prisma/client'
import { Package, AlertTriangle, TrendingUp, DollarSign, Plus, Search, Filter, Download } from 'lucide-react'
import PartsTable from './parts-table';
import LowStockAlert from './low-stock-alert';
import InventoryChart from './inventory-chart'

interface PartWithDetails extends Part {
  supplier: Supplier | null
  _count: {
    transactions: number
    services: number
  }
}

interface InventoryDashboardProps {
  parts: PartWithDetails[]
  lowStockParts: Part[]
  recentTransactions: (InventoryTransaction & { part: Part })[]
  stats: {
    inventoryValue: number
    retailValue: number
    totalParts: number
    outOfStock: number
    lowStock: number
    totalSuppliers: number
    potentialProfit: number
    avgMargin: number
  }
}

export default function InventoryDashboard({
  parts,
  lowStockParts,
  recentTransactions,
  stats,
}: InventoryDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = Array.from(new Set(parts.map(p => p.category)))

  const filteredParts = parts.filter(part => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Inventory Value</p>
              <p className="text-2xl font-bold text-white mt-2">
                ${stats.inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Add this to the stats grid */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Potential Profit</p>
              <p className="text-2xl font-bold text-white mt-2">
                ${stats.potentialProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">Avg. Margin: {stats.avgMargin.toFixed(1)}%</span>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Parts</p>
              <p className="text-2xl font-bold text-white mt-2">{stats.totalParts}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Package className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-white mt-2">{stats.lowStock}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-white mt-2">{stats.outOfStock}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl">
              <Package className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search parts by name, part number, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-5 h-5" />
            Add Part
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PartsTable parts={filteredParts} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <InventoryChart parts={parts} />
          <PartsTable parts={filteredParts} />
        </div>

        <div className="space-y-6">
          <LowStockAlert parts={lowStockParts} />

          {/* Quick Actions */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">Receive Stock</p>
                    <p className="text-sm text-gray-500">Record new inventory arrivals</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">Reorder Parts</p>
                    <p className="text-sm text-gray-500">Generate purchase orders</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">Inventory Report</p>
                    <p className="text-sm text-gray-500">Generate monthly report</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}