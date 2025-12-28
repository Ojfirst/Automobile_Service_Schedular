'use client'

import { useState } from 'react'
import { BarChart3, DollarSign, Calendar, TrendingUp, PieChart, Users, Car, Wrench } from 'lucide-react'
import { Appointment, Service, Vehicle } from '@prisma/client'

interface RevenueData {
  date: Date
  service: {
    price: number
  }
}

interface AnalyticsDashboardProps {
  appointments: (Appointment & { service: Service })[]
  services: Service[]
  revenueData: RevenueData[]
  vehicles: Vehicle[]
}

export default function AnalyticsDashboard({ appointments, services, revenueData, vehicles }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('month')


  // Calculate metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.service.price, 0)
  const avgRevenuePerAppointment = appointments.length > 0 ? totalRevenue / appointments.length : 0
  const completionRate = appointments.length > 0
    ? (appointments.filter(a => a.status === 'COMPLETED').length / appointments.length) * 100
    : 0
  const popularService = services.length > 0
    ? services.reduce((prev, current) =>
      appointments.filter(a => a.serviceId === current.id).length >
        appointments.filter(a => a.serviceId === prev.id).length ? current : prev
    )
    : null

  // Monthly revenue data
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleString('default', { month: 'short' })
    const monthRevenue = revenueData
      .filter(item => new Date(item.date).getMonth() === date.getMonth())
      .reduce((sum, item) => sum + item.service.price, 0)

    return { month: monthName, revenue: monthRevenue }
  }).reverse()

  // Service popularity
  const servicePopularity = services.map(service => ({
    name: service.name,
    count: appointments.filter(a => a.serviceId === service.id).length,
    revenue: appointments
      .filter(a => a.serviceId === service.id && a.status === 'COMPLETED')
      .reduce((sum, a) => sum + a.service.price, 0)
  }))

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white mt-2">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-400" />
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
              <p className="text-gray-400 text-sm">Total Appointments</p>
              <p className="text-2xl font-bold text-white mt-2">{appointments.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white mt-2">{completionRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+5.3% from last month</span>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Revenue per Visit</p>
              <p className="text-2xl font-bold text-white mt-2">${avgRevenuePerAppointment.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+3.7% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-200">Revenue Trend</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end gap-2">
            {monthlyRevenue.map((month, index) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(month.revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100}%` }}
                />
                <span className="text-xs text-gray-400 mt-2">{month.month}</span>
                <span className="text-xs text-gray-500">${month.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Popularity */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">Service Popularity</h3>
          <div className="space-y-4">
            {servicePopularity
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${index === 0 ? 'bg-blue-500/20' :
                      index === 1 ? 'bg-purple-500/20' :
                        index === 2 ? 'bg-green-500/20' : 'bg-gray-800'
                      }`}>
                      <Wrench className={`w-4 h-4 ${index === 0 ? 'text-blue-400' :
                        index === 1 ? 'text-purple-400' :
                          index === 2 ? 'text-green-400' : 'text-gray-400'
                        }`} />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.count} appointments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-200 font-medium">${service.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-white">
                {new Set(appointments.map(a => a.userId)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Car className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Popular Vehicle Make</p>
              <p className="text-2xl font-bold text-white">
                {(() => {
                  const makes = vehicles.map(a => a.make)
                  const frequency = makes.reduce((acc, make) => {
                    acc[make] = (acc[make] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                  const mostFrequent = Object.keys(frequency).reduce((a, b) =>
                    frequency[a] > frequency[b] ? a : b
                  )
                  return mostFrequent || 'N/A'
                })()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Wrench className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Most Popular Service</p>
              <p className="text-2xl font-bold text-white">
                {popularService?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}