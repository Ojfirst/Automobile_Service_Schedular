'use client'

import AdminHeader from '@/components/admin/admin-header';
import AdminSidebar from '@/components/admin/admin-sidebar';
import SettingsForm from '@/components/admin/admin-sidebar/settings-form';

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-black">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">Settings</h1>
            <p className="text-gray-400 mt-2">
              Configure your service center settings and preferences
            </p>
          </div>
          <SettingsForm />
        </main>
      </div>
    </div>
  )
}