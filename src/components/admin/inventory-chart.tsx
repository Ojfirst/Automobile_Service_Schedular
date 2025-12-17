'use client'

import { useState, useEffect } from 'react'
import { Part } from '@prisma/client'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react'

interface InventoryChartProps {
  parts: Part[]
}

export default function InventoryChart({ parts }: InventoryChartProps) {
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('value')

  // Calculate inventory metrics by category
  const categoryData = parts.reduce((acc, part) => {
    if (!acc[part.category]) {
      acc[part.category] = {
        count: 0,
        value: 0,
        cost: 0,
        stock: 0,
      }
    }

    acc[part.category].count += 1
    acc[part.category].value += part.price * part.stock
    acc[part.category].cost += part.cost * part.stock
    acc[part.category].stock += part.stock

    return acc
  }, {} as Record<string, { count: number; value: number; cost: number; stock: number }>)

  const categories = Object.keys(categoryData)

  // Sort categories by selected metric
  const sortedCategories = [...categories].sort((a, b) => {
    if (selectedMetric === 'count') {
      return categoryData[b].count - categoryData[a].count
    } else if (selectedMetric === 'stock') {
      return categoryData[b].stock - categoryData[a].stock
    } else {
      return categoryData[b].value - categoryData[a].value
    }
  })

  const maxValue = Math.max(...Object.values(categoryData).map(d =>
    selectedMetric === 'count' ? d.count :
      selectedMetric === 'stock' ? d.stock :
        d.value
  ))

  // Calculate overall metrics
  const totalValue = parts.reduce((sum, part) => sum + (part.price * part.stock), 0)
  const totalCost = parts.reduce((sum, part) => sum + (part.cost * part.stock), 0)
  const totalItems = parts.reduce((sum, part) => sum + part.stock, 0)
  const marginPercentage = totalValue > 0 ? ((totalValue - totalCost) / totalValue) * 100 : 0

  // Mock trend data (in real app, this would come from your database)
  const trendData = {
    month: {
      valueChange: 12.5,
      stockChange: 8.2,
      itemsChange: 5.7,
      positive: true
    },
    quarter: {
      valueChange: 25.3,
      stockChange: 18.9,
      itemsChange: 12.4,
      positive: true
    },
    year: {
      valueChange: 42.8,
      stockChange: 35.6,
      itemsChange: 28.1,
      positive: true
    },
  }

  const trend = trendData[timeRange as keyof typeof trendData] || trendData.month

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">Inventory Analysis</h3>
          <p className="text-gray-500 text-sm mt-1">Distribution by category</p>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300"
          >
            <option value="value">By Value</option>
            <option value="stock">By Quantity</option>
            <option value="count">By SKUs</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300"
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8">
        <div className="h-64 flex items-end gap-2">
          {sortedCategories.slice(0, 8).map((category) => {
            const data = categoryData[category]
            const value = selectedMetric === 'count' ? data.count :
              selectedMetric === 'stock' ? data.stock :
                data.value

            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

            return (
              <div key={category} className="flex-1 flex flex-col items-center group relative">
                <div
                  className="w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${percentage}%`,
                    background: selectedMetric === 'value'
                      ? 'linear-gradient(to top, #3b82f6, #60a5fa)'
                      : selectedMetric === 'stock'
                        ? 'linear-gradient(to top, #10b981, #34d399)'
                        : 'linear-gradient(to top, #8b5cf6, #a78bfa)'
                  }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-200 font-medium truncate">{category}</span>
                      <div className={`p-1 rounded ${selectedMetric === 'value' ? 'bg-blue-500/20' :
                        selectedMetric === 'stock' ? 'bg-green-500/20' :
                          'bg-purple-500/20'
                        }`}>
                        {selectedMetric === 'value' ? (
                          <DollarSign className="w-3 h-3 text-blue-400" />
                        ) : selectedMetric === 'stock' ? (
                          <Package className="w-3 h-3 text-green-400" />
                        ) : (
                          <BarChart3 className="w-3 h-3 text-purple-400" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Value:</span>
                        <span className="text-gray-200">${data.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stock:</span>
                        <span className="text-gray-200">{data.stock} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SKUs:</span>
                        <span className="text-gray-200">{data.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Price:</span>
                        <span className="text-gray-200">${(data.value / data.stock).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <span className="text-xs text-gray-400 mt-2 truncate w-full text-center">
                  {category.length > 10 ? `${category.substring(0, 8)}..` : category}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-lg font-bold text-white mt-1">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${trend.positive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {trend.positive ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
          <div className={`text-xs mt-2 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.positive ? '+' : ''}{trend.valueChange}% from last {timeRange}
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Stock</p>
              <p className="text-lg font-bold text-white mt-1">{totalItems.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-xs text-green-400 mt-2">
            +{trend.stockChange}% from last {timeRange}
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total SKUs</p>
              <p className="text-lg font-bold text-white mt-1">{parts.length}</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-xs text-green-400 mt-2">
            +{trend.itemsChange}% from last {timeRange}
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Margin</p>
              <p className="text-lg font-bold text-white mt-1">{marginPercentage.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Based on cost vs retail
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-sm text-gray-400">Inventory Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-sm text-gray-400">Stock Quantity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500"></div>
          <span className="text-sm text-gray-400">SKU Count</span>
        </div>
      </div>
    </div>
  )
}