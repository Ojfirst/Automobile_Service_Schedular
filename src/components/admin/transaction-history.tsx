'use client'

import { useState } from 'react'
import { InventoryTransaction, Part } from '@prisma/client'
import { TrendingUp, TrendingDown, Package, Filter, Download, Calendar } from 'lucide-react'

interface TransactionWithPart extends InventoryTransaction {
  part: Part
}

interface TransactionHistoryProps {
  transactions: TransactionWithPart[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [filter, setFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30days')

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'PURCHASE': return 'text-green-400 bg-green-500/10'
      case 'SALE': return 'text-blue-400 bg-blue-500/10'
      case 'ADJUSTMENT': return 'text-yellow-400 bg-yellow-500/10'
      case 'RETURN': return 'text-purple-400 bg-purple-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE': return <TrendingUp className="w-4 h-4" />
      case 'SALE': return <TrendingDown className="w-4 h-4" />
      case 'ADJUSTMENT': return <Package className="w-4 h-4" />
      case 'RETURN': return <TrendingUp className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const totalPurchases = transactions
    .filter(t => t.type === 'PURCHASE')
    .reduce((sum, t) => sum + t.totalPrice, 0)

  const totalSales = transactions
    .filter(t => t.type === 'SALE')
    .reduce((sum, t) => sum + t.totalPrice, 0)

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-200">Transaction History</h2>
            <p className="text-gray-500 text-sm mt-1">Track all inventory movements</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="year">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300"
            >
              <option value="all">All Transactions</option>
              <option value="PURCHASE">Purchases</option>
              <option value="SALE">Sales</option>
              <option value="ADJUSTMENT">Adjustments</option>
              <option value="RETURN">Returns</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold text-white mt-1">{transactions.length}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Purchases</p>
                <p className="text-2xl font-bold text-white mt-1">${totalPurchases.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-white mt-1">${totalSales.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Net Change</p>
                <p className={`text-2xl font-bold mt-1 ${totalPurchases - totalSales >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(totalPurchases - totalSales).toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Package className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-gray-400 font-medium">Date & Time</th>
              <th className="text-left p-4 text-gray-400 font-medium">Part</th>
              <th className="text-left p-4 text-gray-400 font-medium">Type</th>
              <th className="text-left p-4 text-gray-400 font-medium">Quantity</th>
              <th className="text-left p-4 text-gray-400 font-medium">Unit Price</th>
              <th className="text-left p-4 text-gray-400 font-medium">Total</th>
              <th className="text-left p-4 text-gray-400 font-medium">Reference</th>
              <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-4">
                  <div>
                    <p className="text-gray-300">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <Package className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{transaction.part.name}</p>
                      <p className="text-sm text-gray-500">{transaction.part.partNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionColor(transaction.type)} flex items-center gap-2 w-fit`}>
                    {getTransactionIcon(transaction.type)}
                    {transaction.type}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${transaction.type === 'PURCHASE' || transaction.type === 'RETURN'
                      ? 'text-green-400'
                      : 'text-red-400'
                    }`}>
                    {transaction.type === 'PURCHASE' || transaction.type === 'RETURN' ? '+' : '-'}
                    {transaction.quantity}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-gray-300">${transaction.unitPrice.toFixed(2)}</span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${transaction.type === 'PURCHASE' || transaction.type === 'RETURN'
                      ? 'text-green-400'
                      : 'text-red-400'
                    }`}>
                    {transaction.type === 'PURCHASE' || transaction.type === 'RETURN' ? '-' : '+'}$
                    {transaction.totalPrice.toFixed(2)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-gray-500 text-sm">
                    {transaction.reference || 'N/A'}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No transactions found</h3>
          <p className="text-gray-500">
            {filter !== 'all' ? `No ${filter.toLowerCase()} transactions found` : 'No transactions recorded yet'}
          </p>
        </div>
      )}

      {/* Footer */}
      {filteredTransactions.length > 0 && (
        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            Showing {filteredTransactions.length} of {transactions.length} transactions
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
      )}
    </div>
  )
}