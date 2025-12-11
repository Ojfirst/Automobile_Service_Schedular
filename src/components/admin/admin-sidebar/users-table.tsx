'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import { UserCircle, Mail, Calendar, Car, MoreVertical, Search, Filter } from 'lucide-react'

interface UserWithCounts extends User {
  _count: {
    appointments: number
    vehicles: number
  }
}

interface UsersTableProps {
  users: UserWithCounts[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-200">
              Customers ({users.length})
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage customer accounts and view their activity
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 w-full md:w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={selectAllUsers}
                  className="rounded border-gray-700"
                />
              </th>
              <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
              <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
              <th className="text-left p-4 text-gray-400 font-medium">Appointments</th>
              <th className="text-left p-4 text-gray-400 font-medium">Vehicles</th>
              <th className="text-left p-4 text-gray-400 font-medium">Member Since</th>
              <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                    className="rounded border-gray-700"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{user.name || 'Unnamed User'}</p>
                      <p className="text-sm text-gray-500">ID: {user.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">{user.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className={`font-medium ${user._count.appointments > 0 ? 'text-blue-400' : 'text-gray-500'
                      }`}>
                      {user._count.appointments}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-green-400" />
                    <span className={`font-medium ${user._count.vehicles > 0 ? 'text-green-400' : 'text-gray-500'
                      }`}>
                      {user._count.vehicles}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                      View
                    </button>
                    <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <p className="text-gray-500 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          {selectedUsers.length > 0 && (
            <span className="text-blue-400 text-sm">
              {selectedUsers.length} selected
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
          <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
            Next
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <UserCircle className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No users found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try a different search term' : 'No users registered yet'}
          </p>
        </div>
      )}
    </div>
  )
}