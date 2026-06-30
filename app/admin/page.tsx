'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category, Order } from '@/lib/types';
import {
  Crown,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Star,
  Tag,
  LayoutDashboard,
  Settings,
  Search,
  Loader2,
  Bell,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import KPICards from '@/components/admin/KPICards';
import { ChartsSection } from '@/components/admin/Charts';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import QuickActions from '@/components/admin/QuickActions';
import NotificationsPanel from '@/components/admin/NotificationsPanel';

type AdminTab = 'overview' | 'products' | 'orders' | 'categories' | 'coupons';

const SIDEBAR_ITEMS: { id: AdminTab; icon: React.ElementType; label: string }[] = [
  { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders', icon: ShoppingBag, label: 'Orders' },
  { id: 'products', icon: Package, label: 'Products' },
  { id: 'categories', icon: Tag, label: 'Categories' },
  { id: 'coupons', icon: Star, label: 'Coupons' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50 border-amber-200',
  confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
  processing: 'text-blue-600 bg-blue-50 border-blue-200',
  shipped: 'text-purple-600 bg-purple-50 border-purple-200',
  delivered: 'text-green-600 bg-green-50 border-green-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, categories: 0 });
  const [productSearch, setProductSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [pRes, oRes, cRes] = await Promise.all([
      supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('display_order'),
    ]);
    const prods = (pRes.data as Product[]) || [];
    const ords = (oRes.data as Order[]) || [];
    const cats = (cRes.data as Category[]) || [];
    setProducts(prods);
    setOrders(ords);
    setCategories(cats);
    setStats({
      products: prods.length,
      orders: ords.length,
      revenue: ords.reduce((s, o) => s + (o.total || 0), 0),
      categories: cats.length,
    });
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const toggleProductActive = async (product: Product) => {
    await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      )
    );
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const recentOrders = orders.slice(0, 5).map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    customerName: o.shipping_address?.full_name || 'Guest',
    orderAmount: o.total,
    status: o.status as any,
    date: o.created_at,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-navy-800" />
          </div>
          <span className="font-playfair text-white font-bold">EMPIRE ADMIN</span>
        </Link>
        <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
          <Bell className="w-5 h-5 text-pink-400" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-navy-800 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-navy-700">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Crown className="w-5 h-5 text-navy-800" />
            </div>
            <div>
              <div className="font-playfair text-white font-bold text-lg tracking-wide">
                EMPIRE
              </div>
              <div className="font-poppins text-pink-300 text-xs tracking-[0.2em] uppercase">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-xs text-navy-400 uppercase tracking-wider font-medium">
            Main Menu
          </p>
          {SIDEBAR_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-navy-800 shadow-lg'
                  : 'text-navy-300 hover:bg-navy-700/80 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-poppins text-sm font-medium">{label}</span>
              {activeTab === id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-navy-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-300 hover:bg-navy-700 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-poppins text-sm">Back to Store</span>
          </Link>
          <div className="mt-4 p-4 bg-navy-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                <span className="font-playfair font-bold text-navy-800 text-sm">
                  A
                </span>
              </div>
              <div>
                <p className="font-poppins text-white text-sm font-medium">
                  Admin User
                </p>
                <p className="font-poppins text-navy-400 text-xs">
                  admin@empire.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        {/* Top Bar */}
        <header className="hidden lg:flex bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40 px-8 py-4 items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl font-bold text-navy-800 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h1>
            <p className="text-sm text-gray-500 font-poppins mt-0.5">
              Welcome back, Admin! Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20 transition-all"
              />
            </div>
            <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full text-xs text-navy-800 font-bold flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-800 to-navy-700 flex items-center justify-center border-2 border-pink-400">
              <span className="font-playfair font-bold text-white text-sm">
                A
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-navy-800 mx-auto" />
                <p className="font-poppins text-gray-500 mt-4">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  {/* KPI Cards */}
                  <section>
                    <KPICards
                      data={{
                        totalRevenue: {
                          value: `₹${stats.revenue.toLocaleString('en-IN')}`,
                          change: '+12.5%',
                          isPositive: true,
                        },
                        totalOrders: {
                          value: stats.orders.toString(),
                          change: '+8.2%',
                          isPositive: true,
                        },
                        pendingOrders: {
                          value: orders.filter((o) => o.status === 'pending').length.toString(),
                          change: '-5.4%',
                          isPositive: true,
                        },
                        totalCustomers: {
                          value: '892',
                          change: '+15.3%',
                          isPositive: true,
                        },
                        productsSold: {
                          value: stats.products.toString(),
                          change: '+10.8%',
                          isPositive: true,
                        },
                      }}
                    />
                  </section>

                  {/* Charts Section */}
                  <section>
                    <ChartsSection />
                  </section>

                  {/* Quick Actions & Notifications */}
                  <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                      <QuickActions />
                    </div>
                    <div>
                      <NotificationsPanel />
                    </div>
                  </section>

                  {/* Recent Orders Table */}
                  <section>
                    <RecentOrdersTable orders={recentOrders} />
                  </section>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="font-playfair text-xl font-bold text-navy-800">
                      All Orders
                    </h2>
                    <p className="text-sm text-gray-500 font-poppins">
                      Manage and track all customer orders
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Order #', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                            <th
                              key={h}
                              className="text-left px-6 py-4 font-poppins text-xs text-gray-500 font-semibold uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-poppins text-sm font-bold text-navy-800">
                              {order.order_number}
                            </td>
                            <td className="px-6 py-4 font-poppins text-sm text-gray-500">
                              {(order.order_items || []).length} items
                            </td>
                            <td className="px-6 py-4 font-poppins text-sm font-semibold text-navy-800">
                              ₹{order.total?.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4 font-poppins text-sm text-gray-500 capitalize">
                              {order.payment_method || '—'}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-poppins font-semibold border ${
                                  STATUS_COLORS[order.status] || STATUS_COLORS['pending']
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-poppins text-sm text-gray-400">
                              {new Date(order.created_at).toLocaleDateString('en-IN')}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins outline-none text-navy-800 cursor-pointer hover:border-navy-400 transition-colors"
                              >
                                {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-6 py-16 text-center">
                              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="font-poppins text-gray-400">No orders yet</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20 transition-all shadow-sm"
                      />
                    </div>
                    <p className="font-poppins text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm">
                      {filteredProducts.length} products
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            {['Product', 'Category', 'Price', 'Status', 'Badges', 'Actions'].map((h) => (
                              <th
                                key={h}
                                className="text-left px-6 py-4 font-poppins text-xs text-gray-500 font-semibold uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((p) => (
                            <tr
                              key={p.id}
                              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                                    <img
                                      src={p.image_url || ''}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="font-poppins text-sm font-medium text-navy-800">
                                    {p.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-poppins text-sm text-gray-500">
                                  {(p as any).categories?.name || '—'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-poppins text-sm font-semibold text-navy-800">
                                  ₹{p.price}
                                </span>
                                {p.original_price && (
                                  <span className="ml-2 text-sm text-gray-400 line-through font-poppins">
                                    ₹{p.original_price}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => toggleProductActive(p)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-poppins font-semibold border transition-all ${
                                    p.is_active
                                      ? 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                      : 'text-gray-400 bg-gray-50 border-gray-200 hover:bg-gray-100'
                                  }`}
                                >
                                  {p.is_active ? 'Active' : 'Inactive'}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-1.5 flex-wrap">
                                  {p.is_featured && (
                                    <span className="bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-poppins font-medium">
                                      Featured
                                    </span>
                                  )}
                                  {p.is_bestseller && (
                                    <span className="bg-navy-100 text-navy-600 text-xs px-2 py-0.5 rounded-full font-poppins font-medium">
                                      Bestseller
                                    </span>
                                  )}
                                  {p.is_new_arrival && (
                                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-poppins font-medium">
                                      New
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Link
                                  href={`/shop/${p.slug}`}
                                  target="_blank"
                                  className="font-poppins text-sm text-pink-500 hover:text-pink-600 hover:underline"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                    >
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        {cat.image_url && (
                          <img
                            src={cat.image_url}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-playfair font-bold text-navy-800 text-lg">
                          {cat.name}
                        </h3>
                        <p className="font-poppins text-sm text-gray-500 mt-2 line-clamp-2">
                          {cat.description}
                        </p>
                        <Link
                          href={`/shop?category=${cat.slug}`}
                          target="_blank"
                          className="mt-4 text-sm font-poppins font-medium text-pink-500 hover:text-pink-600 flex items-center gap-1"
                        >
                          View Products <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupons Tab */}
              {activeTab === 'coupons' && <CouponRows />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function CouponRows() {
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setCoupons(data || []));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-playfair text-xl font-bold text-navy-800">
          Discount Coupons
        </h2>
        <p className="text-sm text-gray-500 font-poppins">
          Manage promotional codes and discounts
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Code', 'Type', 'Value', 'Min Order', 'Status', 'Expires'].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-4 font-poppins text-xs text-gray-500 font-semibold uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr
                key={c.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-poppins text-sm font-bold text-navy-800 font-mono">
                  {c.code}
                </td>
                <td className="px-6 py-4 font-poppins text-sm text-gray-500 capitalize">
                  {c.discount_type}
                </td>
                <td className="px-6 py-4 font-poppins text-sm font-semibold text-emerald-600">
                  {c.discount_type === 'percentage'
                    ? `${c.discount_value}%`
                    : `₹${c.discount_value}`}
                </td>
                <td className="px-6 py-4 font-poppins text-sm text-gray-500">
                  ₹{c.min_order_amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-poppins font-semibold border ${
                      c.is_active
                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                        : 'text-gray-400 bg-gray-50 border-gray-200'
                    }`}
                  >
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 font-poppins text-sm text-gray-400">
                  {c.expires_at
                    ? new Date(c.expires_at).toLocaleDateString('en-IN')
                    : 'No expiry'}
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-poppins text-gray-400">No coupons found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
