'use client'

import { useState } from 'react'
import { Supplier } from '@prisma/client'
import { Save, X, Building, User, Mail, Phone, MapPin } from 'lucide-react'

interface SupplierFormProps {
  supplier?: Supplier
  onSuccess?: () => void
  onCancel?: () => void
}

export default function SupplierForm({ supplier, onSuccess, onCancel }: SupplierFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contactName: supplier?.contactName || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = supplier ? `/api/inventory/suppliers/${supplier.id}` : '/api/inventory/suppliers'
      const method = supplier ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save supplier')

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error saving supplier:', error)
      alert('Failed to save supplier. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Information
          </h3>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Supplier Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="ACME Auto Parts Inc."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="123 Main St, City, State ZIP"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <User className="w-5 h-5" />
            Contact Person
          </h3>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Contact Name</label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="contact@supplier.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
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
          {isSubmitting ? 'Saving...' : supplier ? 'Update Supplier' : 'Create Supplier'}
        </button>
      </div>
    </form>
  )
}