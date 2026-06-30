'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Mail,
  Shield,
  Palette,
  Globe,
  ArrowLeft,
  ChevronRight,
  Save,
} from 'lucide-react';
import Link from 'next/link';

const settingsSections = [
  {
    id: 'store',
    title: 'Store Settings',
    description: 'Manage store name, logo, and brand colors',
    icon: Store,
    link: '/admin/settings/store',
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    description: 'Configure payment gateways and options',
    icon: CreditCard,
    link: '/admin/settings/payment',
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    description: 'Set up shipping zones and delivery rates',
    icon: Truck,
    link: '/admin/settings/shipping',
  },
  {
    id: 'email',
    title: 'Email Notifications',
    description: 'Configure email templates and alerts',
    icon: Mail,
    link: '/admin/settings/email',
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Two-factor auth and admin controls',
    icon: Shield,
    link: '/admin/settings/security',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize admin dashboard theme',
    icon: Palette,
    link: '/admin/settings/appearance',
  },
];

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('Empire Lifestyle');
  const [storeEmail, setStoreEmail] = useState('support@empirelifestyle.com');
  const [currency, setCurrency] = useState('INR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin?tab=settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-navy-800">Admin Settings</h1>
              <p className="text-sm text-gray-500 font-poppins">
                Configure store settings, payment, and options
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Settings */}
          <Card className="lg:col-span-2 bg-white shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="font-playfair text-lg font-bold text-navy-800">
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm text-gray-600 font-poppins block mb-2">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-poppins block mb-2">Store Email</label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-poppins block mb-2">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <Button className="w-full bg-navy-800 hover:bg-navy-700 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Settings Navigation */}
          <div className="space-y-4">
            {settingsSections.map((section) => (
              <Link key={section.id} href={section.link}>
                <Card className="bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-navy-800/10 flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-navy-800" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-poppins font-semibold text-navy-800">{section.title}</h3>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="mt-8 bg-gradient-to-r from-navy-800 to-navy-700 shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <Globe className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="font-playfair text-xl font-bold text-white mb-2">More Settings Coming Soon</h3>
            <p className="text-navy-200 font-poppins">
              Additional configuration options are being developed. Stay tuned for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
