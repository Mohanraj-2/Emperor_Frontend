'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Calendar,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  // Group orders by customer (using shipping address)
  const customers = orders.reduce((acc: any[], order) => {
    const customerKey = order.shipping_address?.phone || order.user_id || order.id;
    const existing = acc.find(c => c.key === customerKey);
    if (existing) {
      existing.orders += 1;
      existing.totalSpent += order.total || 0;
    } else {
      acc.push({
        key: customerKey,
        name: order.shipping_address?.full_name || 'Guest',
        email: order.user_id ? 'Registered User' : 'Guest Customer',
        phone: order.shipping_address?.phone || 'N/A',
        city: order.shipping_address?.city || 'N/A',
        orders: 1,
        totalSpent: order.total || 0,
        lastOrder: order.created_at,
      });
    }
    return acc;
  }, []);

  const filteredCustomers = customers.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) ||
         c.phone.includes(search)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin?tab=customers" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-navy-800">Customers</h1>
              <p className="text-sm text-gray-500 font-poppins">
                Manage customer profiles and view order history
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center">
                  <Users className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Total Customers</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">{customers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Active Customers</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">
                    {customers.filter(c => c.orders > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">New This Month</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Avg. Order Value</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">
                    ₹{customers.length > 0 ? Math.round(customers.reduce((a, c) => a + c.totalSpent, 0) / customers.length).toLocaleString() : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20 transition-all"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-3 border-navy-800 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filteredCustomers.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Customer', 'Contact', 'Location', 'Orders', 'Total Spent', 'Last Order', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-6 py-4 font-poppins text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-800 to-navy-700 flex items-center justify-center">
                          <span className="font-playfair font-bold text-white text-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-poppins font-medium text-navy-800">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {customer.phone !== 'N/A' && (
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {customer.city}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-poppins font-semibold text-navy-800">{customer.orders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-poppins font-semibold text-emerald-600">
                        ₹{customer.totalSpent.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(customer.lastOrder).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                        View <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-16 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-playfair text-lg font-bold text-navy-800 mb-2">No customers found</h3>
              <p className="text-gray-500 font-poppins">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
