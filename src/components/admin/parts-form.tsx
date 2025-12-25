'use client'

import { useState } from 'react'
import { Part, Supplier } from '@prisma/client'
import { Save, X, Package, DollarSign, Hash, Tag, MapPin, Building } from 'lucide-react'
import { toast } from 'sonner'

interface PartsFormProps {
  part?: Part
  suppliers: Supplier[]
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PartsForm({ part, suppliers, onSuccess, onCancel }: PartsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: part?.name || '',
    partNumber: part?.partNumber || '',
    description: part?.description || '',
    category: part?.category || '',
    manufacturer: part?.manufacturer || '',
    cost: part?.cost || 0,
    price: part?.price || 0,
    stock: part?.stock || 0,
    minStock: part?.minStock || 5,
    maxStock: part?.maxStock || 100,
    location: part?.location || '',
    supplierId: part?.supplierId || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = part ? `/api/inventory/parts/${part.id}` : '/api/inventory/parts'
      const method = part ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      } else {
        toast.success(`Part ${part ? 'updated' : 'created'} successfully!`)
      }

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error saving part:', error)
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    'Engine',
    'Brakes',
    'Suspension',
    'Electrical',
    'Exhaust',
    'Filters',
    'Fluids',
    'Tires',
    'Interior',
    'Exterior',
    'Lighting',
    'Tools',
    'Accessories',
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Basic Information
          </h3>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Part Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Brake Pads Set"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Part Number *
            </label>
            <input
              type="text"
              required
              value={formData.partNumber}
              onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="BP-2024-XL"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Description of the part..."
            />
          </div>
        </div>

        {/* Category & Supplier */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Classification
          </h3>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Manufacturer</label>
            <input
              type="text"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="ACME Auto Parts"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Supplier
            </label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} {supplier.contactName && `- ${supplier.contactName}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Aisle 3, Shelf B"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing
          </h3>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Cost ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">Stock Levels</h3>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Current Stock</label>
            <input
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Minimum Stock</label>
            <input
              type="number"
              min="0"
              required
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 5 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Maximum Stock</label>
            <input
              type="number"
              min="0"
              required
              value={formData.maxStock}
              onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 100 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">Summary</h3>

          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Margin:</span>
              <span className={`font-medium ${formData.price > formData.cost ? 'text-green-400' : 'text-red-400'}`}>
                ${(formData.price - formData.cost).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Margin %:</span>
              <span className={`font-medium ${formData.price > formData.cost ? 'text-green-400' : 'text-red-400'}`}>
                {formData.cost > 0 ? (((formData.price - formData.cost) / formData.cost) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stock Status:</span>
              <span className={`font-medium ${formData.stock === 0 ? 'text-red-400' :
                formData.stock <= formData.minStock ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                {formData.stock === 0 ? 'Out of Stock' :
                  formData.stock <= formData.minStock ? 'Low Stock' :
                    'In Stock'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reorder Qty:</span>
              <span className="text-gray-300 font-medium">
                {Math.max(formData.minStock * 2 - formData.stock, formData.minStock)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Saving...' : part ? 'Update Part' : 'Create Part'}
        </button>
      </div>
    </form>
  )
}