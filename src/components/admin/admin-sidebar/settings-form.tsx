'use client'

import { useState } from 'react'
import { Save, Mail, Phone, MapPin, Clock, Globe, Bell, Shield } from 'lucide-react'

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    businessName: 'AutoCare Pro',
    businessEmail: 'contact@autocarepro.com',
    businessPhone: '+1 (555) 123-4567',
    businessAddress: '123 Auto St, Detroit, MI 48201',
    workingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: 'Closed', close: 'Closed' },
    },
    notifications: {
      email: true,
      sms: true,
      reminders: true,
      promotions: true,
    },
    appointmentSettings: {
      slotDuration: 30,
      maxAppointmentsPerDay: 20,
      advanceBookingDays: 30,
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Saving settings:', settings)
    setIsSaving(false)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appointments', label: 'Appointments', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 space-y-6">
          <h3 className="text-lg font-semibold text-gray-200">Business Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <label className="block text-sm text-gray-400">Business Email</label>
              </div>
              <input
                type="email"
                value={settings.businessEmail}
                onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <label className="block text-sm text-gray-400">Business Phone</label>
              </div>
              <input
                type="tel"
                value={settings.businessPhone}
                onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <label className="block text-sm text-gray-400">Business Address</label>
              </div>
              <input
                type="text"
                value={settings.businessAddress}
                onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-md font-semibold text-gray-300 mb-4">Working Hours</h4>
            <div className="space-y-3">
              {Object.entries(settings.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{day}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => setSettings({
                        ...settings,
                        workingHours: {
                          ...settings.workingHours,
                          [day]: { ...hours, open: e.target.value }
                        }
                      })}
                      disabled={hours.open === 'Closed'}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 disabled:opacity-50"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => setSettings({
                        ...settings,
                        workingHours: {
                          ...settings.workingHours,
                          [day]: { ...hours, close: e.target.value }
                        }
                      })}
                      disabled={hours.close === 'Closed'}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 disabled:opacity-50"
                    />
                    <label className="flex items-center gap-2 ml-4">
                      <input
                        type="checkbox"
                        checked={hours.open === 'Closed'}
                        onChange={(e) => setSettings({
                          ...settings,
                          workingHours: {
                            ...settings.workingHours,
                            [day]: {
                              open: e.target.checked ? 'Closed' : '09:00',
                              close: e.target.checked ? 'Closed' : '18:00'
                            }
                          }
                        })}
                        className="rounded border-gray-700"
                      />
                      <span className="text-sm text-gray-400">Closed</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appointment Settings */}
      {activeTab === 'appointments' && (
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 space-y-6">
          <h3 className="text-lg font-semibold text-gray-200">Appointment Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Slot Duration (minutes)</label>
              <input
                type="number"
                value={settings.appointmentSettings.slotDuration}
                onChange={(e) => setSettings({
                  ...settings,
                  appointmentSettings: {
                    ...settings.appointmentSettings,
                    slotDuration: parseInt(e.target.value)
                  }
                })}
                min="15"
                max="120"
                step="15"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Appointments Per Day</label>
              <input
                type="number"
                value={settings.appointmentSettings.maxAppointmentsPerDay}
                onChange={(e) => setSettings({
                  ...settings,
                  appointmentSettings: {
                    ...settings.appointmentSettings,
                    maxAppointmentsPerDay: parseInt(e.target.value)
                  }
                })}
                min="1"
                max="100"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Advance Booking (days)</label>
              <input
                type="number"
                value={settings.appointmentSettings.advanceBookingDays}
                onChange={(e) => setSettings({
                  ...settings,
                  appointmentSettings: {
                    ...settings.appointmentSettings,
                    advanceBookingDays: parseInt(e.target.value)
                  }
                })}
                min="1"
                max="365"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 space-y-6">
          <h3 className="text-lg font-semibold text-gray-200">Notification Settings</h3>

          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div>
                  <h4 className="text-gray-300 font-medium capitalize">{key}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {key === 'email' && 'Send email notifications to customers'}
                    {key === 'sms' && 'Send SMS notifications to customers'}
                    {key === 'reminders' && 'Send appointment reminders'}
                    {key === 'promotions' && 'Send promotional offers'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [key]: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}