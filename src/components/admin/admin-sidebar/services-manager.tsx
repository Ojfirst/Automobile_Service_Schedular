'use client'

import { useState } from 'react'
import { Service } from '@prisma/client'
import { Plus, Edit2, Trash2, DollarSign, Clock, Search, Wrench } from 'lucide-react'

interface ServicesManagerProps {
  services: Service[]
}

export default function ServicesManager({ services }: ServicesManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingService, setIsAddingService] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 60,
  })

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddService = async () => {
    // Implement API call to add service
    console.log('Adding service:', newService)
    setIsAddingService(false)
    setNewService({ name: '', description: '', price: 0, duration: 60 })
  }

  const handleUpdateService = async (service: Service) => {
    // Implement API call to update service
    console.log('Updating service:', service)
    setEditingService(null)
  }

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      // Implement API call to delete service
      console.log('Deleting service:', id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setIsAddingService(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingService || editingService) && (
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Service Name</label>
              <input
                type="text"
                value={editingService ? editingService.name : newService.name}
                onChange={(e) => editingService
                  ? setEditingService({ ...editingService, name: e.target.value })
                  : setNewService({ ...newService, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Oil Change"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
              <input
                type="number"
                value={editingService ? editingService.price : newService.price}
                onChange={(e) => editingService
                  ? setEditingService({ ...editingService, price: parseFloat(e.target.value) })
                  : setNewService({ ...newService, price: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="49.99"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={editingService ? editingService.duration : newService.duration}
                onChange={(e) => editingService
                  ? setEditingService({ ...editingService, duration: parseInt(e.target.value) })
                  : setNewService({ ...newService, duration: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="60"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea
                value={editingService ? editingService.description || '' : newService.description}
                onChange={(e) => editingService
                  ? setEditingService({ ...editingService, description: e.target.value })
                  : setNewService({ ...newService, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Description of the service..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setIsAddingService(false)
                setEditingService(null)
              }}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => editingService ? handleUpdateService(editingService) : handleAddService()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">{service.name}</h3>
                {service.description && (
                  <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">${service.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">{service.duration} min</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm text-gray-300">
                  {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <Wrench className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No services found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try a different search term' : 'Add your first service to get started'}
          </p>
          <button
            onClick={() => setIsAddingService(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>
      )}
    </div>
  )
}