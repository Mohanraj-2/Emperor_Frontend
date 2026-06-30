'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Download,
  Calendar,
  ArrowLeft,
  FileBarChart,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Order, Product } from '@/lib/types';

const revenueData = [
  { name: 'Jan', revenue: 45000, orders: 120, profit: 18000 },
  { name: 'Feb', revenue: 52000, orders: 145, profit: 21000 },
  { name: 'Mar', revenue: 48000, orders: 132, profit: 19000 },
  { name: 'Apr', revenue: 61000, orders: 178, profit: 24000 },
  { name: 'May', revenue: 55000, orders: 156, profit: 22000 },
  { name: 'Jun', revenue: 67000, orders: 198, profit: 27000 },
  { name: 'Jul', revenue: 72000, orders: 215, profit: 29000 },
];

const topProducts = [
  { name: 'Classic Black T-Shirt', sales: 245, revenue: 171150 },
  { name: 'Oversized Hoodie', sales: 189, revenue: 245581 },
  { name: 'Gold Pendant', sales: 156, revenue: 233844 },
  { name: 'Premium Cap', sales: 134, revenue: 66766 },
  { name: 'White Oversized Tee', sales: 112, revenue: 78288 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [oRes, pRes] = await Promise.all([
      supabase.from('orders').select('*'),
      supabase.from('products').select('*'),
    ]);
    setOrders(oRes.data || []);
    setProducts(pRes.data || []);
    setLoading(false);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin?tab=reports" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-navy-800">Reports & Analytics</h1>
              <p className="text-sm text-gray-500 font-poppins">
                Sales reports, revenue analytics, and product insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
              {[
                { value: '7d', label: '7 Days' },
                { value: '30d', label: '30 Days' },
                { value: '90d', label: '90 Days' },
                { value: '12m', label: '12 Months' },
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDateRange(d.value as any)}
                  className={`px-3 py-1.5 rounded-md text-sm font-poppins transition-colors ${
                    dateRange === d.value
                      ? 'bg-navy-800 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <Button className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Total Revenue</p>
                  <p className="text-3xl font-playfair font-bold text-navy-800">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-emerald-500 font-poppins mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +12.5%
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-pink-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Total Orders</p>
                  <p className="text-3xl font-playfair font-bold text-navy-800">{totalOrders}</p>
                  <p className="text-sm text-emerald-500 font-poppins mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +8.2%
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <ShoppingCart className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Avg Order Value</p>
                  <p className="text-3xl font-playfair font-bold text-navy-800">
                    ₹{avgOrderValue.toLocaleString()}
                  </p>
                  <p className="text-sm text-emerald-500 font-poppins mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +5.3%
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Delivered Orders</p>
                  <p className="text-3xl font-playfair font-bold text-navy-800">{deliveredOrders}</p>
                  <p className="text-sm text-gray-400 font-poppins mt-1">
                    of {totalOrders} total
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Package className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="bg-white shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-playfair text-lg font-bold text-navy-800">
                  Revenue Trend
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-navy-800" />
                  <span className="text-xs text-gray-500">Revenue</span>
                  <div className="w-3 h-3 rounded-full bg-pink-400 ml-4" />
                  <span className="text-xs text-gray-500">Profit</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B1F4D" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0B1F4D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#0B1F4D" fill="url(#revenueGrad)" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#F7B6C6" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card className="bg-white shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-playfair text-lg font-bold text-navy-800">
                  Orders Overview
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#F7B6C6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="bg-white shadow-md rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-playfair text-lg font-bold text-navy-800">
                Top Selling Products
              </CardTitle>
              <Button variant="ghost" className="text-pink-500">
                View All Products
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Product', 'Units Sold', 'Revenue', '% of Total'].map((h) => (
                      <th key={h} className="text-left py-4 px-4 text-xs text-gray-500 font-semibold uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => {
                    const percent = ((product.revenue / totalRevenue) * 100).toFixed(1);
                    return (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-navy-800">#{idx + 1}</span>
                            </div>
                            <span className="font-poppins font-medium text-navy-800">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-poppins text-gray-600">{product.sales}</td>
                        <td className="py-4 px-4 font-poppins font-semibold text-emerald-600">
                          ₹{product.revenue.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-navy-800 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{percent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
