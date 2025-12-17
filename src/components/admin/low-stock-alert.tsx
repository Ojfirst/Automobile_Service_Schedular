'use client'

import { Part } from '@prisma/client'
import { AlertTriangle, Package, ArrowRight, ShoppingCart } from 'lucide-react'

interface LowStockAlertProps {
  parts: Part[]
}

export default function LowStockAlert({ parts }: LowStockAlertProps) {
  if (parts.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-4">
            <Package className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-200 mb-2">All Stock Levels Good</h3>
          <p className="text-gray-500 text-sm">
            No items are currently below minimum stock levels
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-yellow-500/30 overflow-hidden">
      <div className="p-6 border-b border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Low Stock Alert</h3>
              <p className="text-yellow-400 text-sm">
                {parts.length} item{parts.length !== 1 ? 's' : ''} need{parts.length === 1 ? 's' : ''} reordering
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm">
            <ShoppingCart className="w-4 h-4" />
            Order All
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {parts.map((part) => (
          <div key={part.id} className="p-4 border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 font-medium truncate">{part.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">PN: {part.partNumber}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{part.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 ml-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 font-medium">{part.stock}</span>
                    <span className="text-gray-500">/</span>
                    <span className="text-yellow-400">{part.minStock}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Current / Min</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-sm">Reorder Qty</span>
                    <span className="text-gray-300 font-medium">
                      {Math.max(part.minStock * 2 - part.stock, part.minStock)}
                    </span>
                  </div>

                  <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Stock Level</span>
                <span>{Math.round((part.stock / part.maxStock) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${part.stock === 0
                      ? 'bg-red-500'
                      : part.stock <= part.minStock
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  style={{ width: `${(part.stock / part.maxStock) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-800/20">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">
            {parts.filter(p => p.stock === 0).length} items out of stock
          </span>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View All Low Stock Items →
          </button>
        </div>
      </div>
    </div>
  )
}