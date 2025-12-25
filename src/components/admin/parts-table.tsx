'use client'

import { useState } from 'react'
import type { Part, Supplier } from '@prisma/client'
import { Package, AlertTriangle, Edit2, ExternalLink, MoreVertical } from 'lucide-react';
import PartsForm from './parts-form';

interface PartWithDetails extends Part {
  supplier: Supplier | null
  _count: {
    transactions: number
    services: number
  }
}

type PartsTableProps = {
  parts: PartWithDetails[]
  isLoading?: boolean
}

export default function PartsTable({ parts, isLoading = false }: PartsTableProps) {
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [showPartsForm, setShowPartsForm] = useState<boolean>(false);
  // currently editing part (null when creating a new part)
  const [editingPart, setEditingPart] = useState<PartWithDetails | null>(null);

  // suppliers list (non-null)
  const editSuppliers = parts.map(part => part.supplier).filter((s): s is Supplier => !!s);

  // open the parts form; pass a part to edit or nothing to create
  const handleShowPartsForm = (part?: PartWithDetails) => {
    setEditingPart(part ?? null);
    setShowPartsForm(true);
  }

  // Render form when requested
  const renderPartsForm = () => {
    if (!showPartsForm) return null;

    return (
      <div className="p-6 border-b border-gray-800">
        <PartsForm
          part={editingPart ?? undefined}
          suppliers={editSuppliers}
          onCancel={() => { setShowPartsForm(false); setEditingPart(null); }}
          onSuccess={() => { setShowPartsForm(false); setEditingPart(null); }}
        />
      </div>
    );
  }

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Out of Stock' }
    if (stock <= minStock) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Low Stock' }
    return { color: 'text-green-400', bg: 'bg-green-500/10', label: 'In Stock' }
  }

  const toggleSelectPart = (partId: string) => {
    setSelectedParts(prev =>
      prev.includes(partId)
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    )
  }

  const selectAllParts = () => {
    if (selectedParts.length === parts.length && parts.length > 0) {
      setSelectedParts([])
    } else {
      setSelectedParts(parts.map(part => part.id))
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-800 rounded w-1/4"></div>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-32"></div>
                    <div className="h-3 bg-gray-800 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-800 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-200">
            Parts ({parts.length})
          </h2>
          <div className="text-sm text-gray-500">
            {selectedParts.length > 0 && (
              <span className="text-blue-400 mr-4">
                {selectedParts.length} selected
              </span>
            )}
            Sorted by: <span className="text-gray-300">Name</span>
          </div>
        </div>
      </div>

      {/* Parts form (create/edit) */}
      {renderPartsForm()}

      {parts.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No parts found</h3>
          <p className="text-gray-500">Add your first part to get started</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedParts.length === parts.length && parts.length > 0}
                      onChange={selectAllParts}
                      className="rounded border-gray-700"
                    />
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">Part Details</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Stock</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Pricing</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Supplier</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part) => {
                  const stockStatus = getStockStatus(part.stock, part.minStock)

                  return (
                    <tr key={part.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedParts.includes(part.id)}
                          onChange={() => toggleSelectPart(part.id)}
                          className="rounded border-gray-700"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-800 rounded-lg">
                            <Package className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-gray-200 font-medium">{part.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-gray-500">PN: {part.partNumber}</span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">{part.category}</span>
                            </div>
                            {part.description && (
                              <p className="text-sm text-gray-400 mt-1 line-clamp-1">{part.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                            {part.stock <= part.minStock && (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-300">{part.stock} in stock</span>
                            <span className="text-gray-500 mx-2">•</span>
                            <span className="text-gray-500">Min: {part.minStock}</span>
                            <span className="text-gray-500 mx-2">•</span>
                            <span className="text-gray-500">Max: {part.maxStock}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div>
                            <span className="text-gray-400 text-sm">Cost: </span>
                            <span className="text-gray-300">${part.cost.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Price: </span>
                            <span className="text-gray-300 font-medium">${part.price.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Margin: {(((part.price - part.cost) / part.cost) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {part.supplier ? (
                          <div>
                            <p className="text-gray-300 truncate">{part.supplier.name ?? 'No supplier name found'}</p>
                            <p className="text-sm text-gray-500 truncate">{part.supplier.contactName ?? 'No contact name found'}</p>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No supplier</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShowPartsForm(part)}
                            className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                            title="Edit part"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => console.log('View part:', part.id)}
                            className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                            title="View details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              Showing {parts.length} parts
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
  )
}