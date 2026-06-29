'use client';
import { useState, useEffect } from 'react';
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
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  Loader2,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

type AdminTab = 'overview' | 'products' | 'orders' | 'categories' | 'coupons';

const SIDEBAR_ITEMS: { id: AdminTab; icon: React.ElementType; label: string }[] = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'products', icon: Package, label: 'Products' },
  { id: 'orders', icon: ShoppingBag, label: 'Orders' },
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

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
    const prods = pRes.data as Product[] || [];
    const ords = oRes.data as Order[] || [];
    const cats = cRes.data as Category[] || [];
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
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  const toggleProductActive = async (product: Product) => {
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);
    await supabase.from('products').update({
      name: editingProduct.name,
      price: editingProduct.price,
      original_price: editingProduct.original_price,
      description: editingProduct.description,
      badge: editingProduct.badge,
      is_featured: editingProduct.is_featured,
      is_bestseller: editingProduct.is_bestseller,
      is_new_arrival: editingProduct.is_new_arrival,
    }).eq('id', editingProduct.id);
    setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    setSaving(false);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const STAT_CARDS = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'bg-pink-50 text-pink-600' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0 min-h-screen">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-gray-900" />
            </div>
            <div>
              <div className="font-playfair text-white font-bold text-sm">EMPIRE</div>
              <div className="font-poppins text-pink-300 text-[8px] tracking-widest">ADMIN</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {SIDEBAR_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeTab === id
                  ? 'bg-pink-400 text-gray-900'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-poppins text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
            <span className="font-poppins text-sm">Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="font-poppins font-bold text-gray-900 text-lg capitalize">
            {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-pink-400" />
            </div>
            <span className="font-poppins text-sm font-medium text-gray-900">Admin</span>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            </div>
          ) : (
            <>
              {/* Overview */}
              {activeTab === 'overview' && (
                <div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="bg-white rounded-2xl shadow-card p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-poppins text-xs text-gray-500">{label}</span>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="font-playfair text-2xl font-bold text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-poppins font-semibold text-gray-900">Recent Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-xs text-pink-500 font-poppins hover:underline">
                        View all →
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            {['Order #', 'Total', 'Status', 'Date'].map((h) => (
                              <th key={h} className="text-left py-3 font-poppins text-xs text-gray-400 font-medium pb-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-b border-gray-50">
                              <td className="py-3 font-poppins text-xs font-semibold text-gray-900">{order.order_number}</td>
                              <td className="py-3 font-poppins text-xs text-gray-900">₹{order.total?.toLocaleString('en-IN')}</td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-poppins font-semibold border ${STATUS_COLORS[order.status] || STATUS_COLORS['pending']}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 font-poppins text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleDateString('en-IN')}
                              </td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr><td colSpan={4} className="py-8 text-center font-poppins text-xs text-gray-400">No orders yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-2xl shadow-card p-6">
                    <h3 className="font-poppins font-semibold text-gray-900 mb-5">Products Overview</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {products.slice(0, 6).map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                            <img src={p.image_url || ''} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-poppins text-xs font-medium text-gray-900 truncate">{p.name}</p>
                            <p className="font-poppins text-xs text-pink-500 font-bold">₹{p.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Products */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm font-poppins outline-none focus:border-gray-600"
                      />
                    </div>
                    <span className="font-poppins text-xs text-gray-500">{filteredProducts.length} products</span>
                  </div>

                  <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Product', 'Category', 'Price', 'Status', 'Badges', 'Actions'].map((h) => (
                            <th key={h} className="text-left px-5 py-4 font-poppins text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img src={p.image_url || ''} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-poppins text-xs font-medium text-gray-900">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-poppins text-xs text-gray-500">{(p as any).categories?.name || '—'}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-poppins text-xs font-semibold text-gray-900">₹{p.price}</span>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => toggleProductActive(p)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-poppins font-semibold border transition-colors ${
                                  p.is_active
                                    ? 'text-green-600 bg-green-50 border-green-200'
                                    : 'text-gray-400 bg-gray-50 border-gray-200'
                                }`}
                              >
                                {p.is_active ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-1 flex-wrap">
                                {p.is_featured && <span className="badge-new text-[9px] px-1.5">Featured</span>}
                                {p.is_bestseller && <span className="badge-bestseller text-[9px] px-1.5">Best</span>}
                                {p.is_new_arrival && <span className="badge-new text-[9px] px-1.5">New</span>}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-600 transition-colors"
                                >
                                  <Edit2 className="w-3 h-3 text-gray-400" />
                                </button>
                                <Link href={`/shop/${p.slug}`} target="_blank" className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-600 transition-colors">
                                  <Eye className="w-3 h-3 text-gray-400" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders */}
              {activeTab === 'orders' && (
                <div>
                  <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Order #', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                            <th key={h} className="text-left px-5 py-4 font-poppins text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 font-poppins text-xs font-bold text-gray-900">{order.order_number}</td>
                            <td className="px-5 py-4 font-poppins text-xs text-gray-500">{(order.order_items || []).length} items</td>
                            <td className="px-5 py-4 font-poppins text-xs font-semibold text-gray-900">₹{order.total?.toLocaleString('en-IN')}</td>
                            <td className="px-5 py-4 font-poppins text-xs text-gray-500 capitalize">{order.payment_method || '—'}</td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-poppins font-semibold border ${STATUS_COLORS[order.status] || STATUS_COLORS['pending']}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-poppins text-xs text-gray-400">
                              {new Date(order.created_at).toLocaleDateString('en-IN')}
                            </td>
                            <td className="px-5 py-4">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-poppins outline-none text-gray-900 cursor-pointer"
                              >
                                {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={7} className="px-5 py-12 text-center font-poppins text-sm text-gray-400">No orders found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Categories */}
              {activeTab === 'categories' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
                      <div className="aspect-video bg-gray-50 overflow-hidden">
                        {cat.image_url && (
                          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-poppins font-semibold text-gray-900 text-sm">{cat.name}</h3>
                        <p className="font-poppins text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                        <Link href={`/shop?category=${cat.slug}`} target="_blank" className="mt-3 text-xs font-poppins text-pink-500 hover:underline flex items-center gap-1">
                          View Products →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupons */}
              {activeTab === 'coupons' && (
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Code', 'Type', 'Value', 'Min Order', 'Status', 'Expires'].map((h) => (
                          <th key={h} className="text-left px-5 py-4 font-poppins text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <CouponRows />
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-playfair text-xl font-bold text-gray-900">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Name</label>
                <input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gray-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Price (₹)</label>
                  <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gray-600" />
                </div>
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Original Price (₹)</label>
                  <input type="number" value={editingProduct.original_price || ''} onChange={(e) => setEditingProduct({ ...editingProduct, original_price: Number(e.target.value) || null })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gray-600" />
                </div>
              </div>
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Badge</label>
                <select value={editingProduct.badge || ''} onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value || null })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gray-600">
                  <option value="">None</option>
                  <option value="NEW">NEW</option>
                  <option value="SALE">SALE</option>
                  <option value="BESTSELLER">BESTSELLER</option>
                </select>
              </div>
              <div className="flex gap-4">
                {[
                  { key: 'is_featured', label: 'Featured' },
                  { key: 'is_bestseller', label: 'Bestseller' },
                  { key: 'is_new_arrival', label: 'New Arrival' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!(editingProduct as any)[key]}
                      onChange={(e) => setEditingProduct({ ...editingProduct, [key]: e.target.checked } as any)}
                      className="accent-gray-900" />
                    <span className="font-poppins text-xs text-gray-600">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingProduct(null)} className="flex-1 btn-outline py-3 rounded-xl text-sm">
                Cancel
              </button>
              <button onClick={saveProduct} disabled={saving} className="flex-1 btn-navy justify-center py-3 rounded-xl text-sm">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Check className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CouponRows() {
  const [coupons, setCoupons] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('coupons').select('*').order('created_at', { ascending: false }).then(({ data }) => setCoupons(data || []));
  }, []);
  return (
    <tbody>
      {coupons.map((c) => (
        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
          <td className="px-5 py-4 font-poppins text-xs font-bold text-gray-900 font-mono">{c.code}</td>
          <td className="px-5 py-4 font-poppins text-xs text-gray-500 capitalize">{c.discount_type}</td>
          <td className="px-5 py-4 font-poppins text-xs font-semibold text-green-600">
            {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
          </td>
          <td className="px-5 py-4 font-poppins text-xs text-gray-500">₹{c.min_order_amount}</td>
          <td className="px-5 py-4">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-poppins font-semibold border ${c.is_active ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-400 bg-gray-50 border-gray-200'}`}>
              {c.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-5 py-4 font-poppins text-xs text-gray-400">
            {c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : 'No expiry'}
          </td>
        </tr>
      ))}
      {coupons.length === 0 && (
        <tr><td colSpan={6} className="px-5 py-12 text-center font-poppins text-sm text-gray-400">No coupons found</td></tr>
      )}
    </tbody>
  );
}
