'use client'

import { useState, useEffect } from 'react'
import type { Part, Supplier, InventoryTransaction, User as DbUser } from '@prisma/client'
import { Package, AlertTriangle, TrendingUp, Plus, Search, Download, BarChart3, Building, DollarSignIcon, ToolCaseIcon, Eye, User2 } from 'lucide-react'
import { RoleType } from '@/prisma.db'
import PartsTable from './parts-table'
import LowStockAlert from './low-stock-alert'
import InventoryChart from './inventory-chart'
import TransactionHistory from './transaction-history'
import PartsForm from './parts-form'
import SupplierForm from './supplier-form'
// NOTE: Don't import server-only Clerk APIs into this client component.
// Use the client-side API endpoint `GET /api/auth/me` instead.

interface PartWithDetails extends Part {
  supplier: Supplier | null
  _count: {
    transactions: number
    services: number
  }
}

type InventoryDashboardProps = {
  parts: PartWithDetails[]
  lowStockParts: Part[]
  recentTransactions: (InventoryTransaction & { part: Part })[]
  suppliers: Supplier[]
}

export default function InventoryDashboard({
  parts,
  lowStockParts,
  recentTransactions,
  suppliers,
}: InventoryDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPartsForm, setShowPartsForm] = useState(false)
  const [showSupplierForm, setShowSupplierForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const [dbUser, setDbUser] = useState<DbUser | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (!res.ok) return setDbUser(null)
        const data = await res.json()
        setDbUser(data.dbUser ?? null)
      })
      .catch(() => setDbUser(null))
  }, [])





  // Get unique categories
  const categories = Array.from(new Set(parts.map(p => p.category)))

  const filteredParts = parts.filter(part => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleAddPartSuccess = () => {
    setShowPartsForm(false)
    // In a real app, you would refresh the data here
    window.location.reload()
  }

  const handleAddSupplierSuccess = () => {
    setShowSupplierForm(false)
    // In a real app, you would refresh the data here
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeTab === 'overview'
            ? 'bg-gray-900 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('parts')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeTab === 'parts'
            ? 'bg-gray-900 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
        >
          <ToolCaseIcon className="w-4 h-4 inline mr-2" />
          Parts ({parts?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeTab === 'transactions'
            ? 'bg-gray-900 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
        >
          <DollarSignIcon className="w-4 h-4 inline mr-2" />
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeTab === 'suppliers'
            ? 'bg-gray-900 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
        >
          <Building className="w-4 h-4 inline mr-2" />
          Suppliers ({suppliers?.length || 0})
        </button>

        {dbUser?.role === RoleType.SUPER_ADMIN && (
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${activeTab === 'roles'
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
          >
            <User2 className="w-4 h-4 inline mr-2" />
            Roles
          </button>
        )}


      </div>

      {/* Add Part Form Modal */}
      {showPartsForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-200">Add New Part</h2>
                <button
                  onClick={() => setShowPartsForm(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="text-gray-400 hover:text-white">✕</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <PartsForm
                suppliers={suppliers}
                onSuccess={handleAddPartSuccess}
                onCancel={() => setShowPartsForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showSupplierForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-200">Add New Supplier</h2>
                <button
                  onClick={() => setShowSupplierForm(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="text-gray-400 hover:text-white">✕</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <SupplierForm
                onSuccess={handleAddSupplierSuccess}
                onCancel={() => setShowSupplierForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
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
              <button
                onClick={() => setShowPartsForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
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
                  <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-200 font-medium">Stock Take</p>
                        <p className="text-sm text-gray-500">Conduct physical inventory count</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Parts Tab */}
      {activeTab === 'parts' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search parts..."
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
              <button
                onClick={() => setShowPartsForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Part
              </button>
            </div>
          </div>
          <PartsTable parts={filteredParts} />
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <TransactionHistory transactions={recentTransactions} />
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-200">Suppliers</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Manage your parts suppliers and contact information
                </p>
              </div>
              <button
                onClick={() => setShowSupplierForm(true)} // Update this
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Supplier
              </button>
            </div>
          </div>

          {!suppliers || suppliers.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
                <Building className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No suppliers found</h3>
              <p className="text-gray-500">Add your first supplier to get started</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400 font-medium">Supplier</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Parts</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Total Value</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => {
                      const supplierParts = parts.filter(p => p.supplierId === supplier.id)
                      const supplierValue = supplierParts.reduce((sum, part) => sum + (part.stock * part.cost), 0)

                      return (
                        <tr key={supplier.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-gray-300 font-medium">
                                  {supplier.name.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-200 font-medium">{supplier.name}</p>
                                {supplier.email && (
                                  <p className="text-sm text-gray-500">{supplier.email}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-gray-300">{supplier.contactName || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{supplier.phone || 'No phone'}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-300 font-medium">{supplierParts.length}</span>
                            <p className="text-sm text-gray-500">parts</p>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-300 font-medium">
                              ${supplierValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <p className="text-sm text-gray-500">inventory value</p>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                                Edit
                              </button>
                              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-800 flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                  Showing {suppliers.length} suppliers
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}