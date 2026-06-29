'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Order } from '@/lib/types';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Crown,
  ChevronRight,
  Check,
  Truck,
  Clock,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: 'text-amber-600 bg-amber-50', icon: Clock, label: 'Pending' },
  confirmed: { color: 'text-blue-600 bg-blue-50', icon: Check, label: 'Confirmed' },
  processing: { color: 'text-blue-600 bg-blue-50', icon: Package, label: 'Processing' },
  shipped: { color: 'text-purple-600 bg-purple-50', icon: Truck, label: 'Shipped' },
  delivered: { color: 'text-green-600 bg-green-50', icon: Check, label: 'Delivered' },
  cancelled: { color: 'text-red-600 bg-red-50', icon: XCircle, label: 'Cancelled' },
};

const TABS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'orders', icon: Package, label: 'Orders' },
  { id: 'wishlist', icon: Heart, label: 'Wishlist' },
  { id: 'addresses', icon: MapPin, label: 'Addresses' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { user, signOut } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/auth/login');
    });
  }, [router]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      setOrdersLoading(true);
      supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setOrders(data as Order[] || []);
          setOrdersLoading(false);
        });
    }
  }, [activeTab, user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-navy-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-navy-800" />
            </div>
            <div>
              <p className="font-poppins text-navy-300 text-sm">Welcome back,</p>
              <h1 className="font-playfair text-2xl font-bold text-white">{userName}</h1>
              <p className="font-poppins text-navy-300 text-xs mt-0.5">{user?.email}</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 bg-pink-400/20 rounded-full px-4 py-2">
              <Crown className="w-4 h-4 text-pink-400" />
              <span className="font-poppins text-pink-300 text-xs font-medium">Empire Member</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-4 space-y-1">
              {TABS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    activeTab === id
                      ? 'bg-navy-800 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="font-poppins text-sm font-medium">{label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-poppins text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-poppins font-semibold text-navy-800 text-base mb-6">Profile Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', value: user?.user_metadata?.full_name || 'Not set' },
                    { label: 'Email Address', value: user?.email || 'Not set' },
                    { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A' },
                    { label: 'Account Status', value: 'Active' },
                  ].map(({ label, value }) => (
                    <div key={label} className="border border-gray-100 rounded-xl p-4">
                      <div className="font-poppins text-xs text-gray-400 mb-1">{label}</div>
                      <div className="font-poppins font-medium text-navy-800 text-sm">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="font-poppins font-semibold text-navy-800 text-sm">Empire Loyalty Program</div>
                      <div className="font-poppins text-xs text-gray-500">Earn points on every purchase • Exclusive member benefits</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-poppins font-semibold text-navy-800 text-base mb-6">Order History</h2>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="font-poppins text-gray-400 text-sm">No orders yet.</p>
                    <Link href="/shop" className="btn-navy text-xs px-6 py-2.5 rounded-full mt-4 inline-flex">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
                      const StatusIcon = cfg.icon;
                      return (
                        <div key={order.id} className="border border-gray-100 rounded-2xl p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-poppins font-bold text-navy-800 text-sm">#{order.order_number}</span>
                              <span className="font-poppins text-xs text-gray-400 ml-3">
                                {new Date(order.created_at).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-semibold ${cfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                          </div>
                          {order.order_items && order.order_items.length > 0 && (
                            <div className="space-y-1 mb-3">
                              {order.order_items.slice(0, 2).map((item) => (
                                <div key={item.id} className="font-poppins text-xs text-gray-600">
                                  {item.product_name} × {item.quantity}
                                </div>
                              ))}
                              {order.order_items.length > 2 && (
                                <div className="font-poppins text-xs text-gray-400">
                                  +{order.order_items.length - 2} more items
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="font-poppins font-bold text-navy-800">₹{order.total.toLocaleString('en-IN')}</span>
                            <span className="font-poppins text-xs text-pink-500 capitalize">{order.payment_method}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-poppins font-semibold text-navy-800 text-base mb-6">
                  My Wishlist ({wishlistItems.length})
                </h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="font-poppins text-gray-400 text-sm">No items in wishlist.</p>
                    <Link href="/shop" className="btn-navy text-xs px-6 py-2.5 rounded-full mt-4 inline-flex">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlistItems.slice(0, 6).map((p) => (
                      <Link key={p.id} href={`/shop/${p.slug}`} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-card transition-shadow">
                        <div className="aspect-square bg-gray-50">
                          <img src={p.image_url || ''} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <p className="font-poppins text-xs font-medium text-navy-800 truncate">{p.name}</p>
                          <p className="font-poppins text-sm font-bold text-navy-800 mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-poppins font-semibold text-navy-800 text-base">Saved Addresses</h2>
                  <button className="btn-navy text-xs px-4 py-2.5 rounded-full">+ Add Address</button>
                </div>
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="font-poppins text-gray-400 text-sm">No saved addresses yet.</p>
                  <p className="font-poppins text-xs text-gray-300 mt-1">Add your delivery addresses for faster checkout.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
