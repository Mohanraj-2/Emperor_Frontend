'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  User,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50 border-amber-200',
  confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
  processing: 'text-blue-600 bg-blue-50 border-blue-200',
  shipped: 'text-purple-600 bg-purple-50 border-purple-200',
  delivered: 'text-green-600 bg-green-50 border-green-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
};

const statusTimeline = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', params.id)
      .single();
    setOrder(data);
    setLoading(false);
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
    setOrder({ ...order, status: newStatus });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-3 border-navy-800 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="font-playfair text-xl font-bold text-navy-800 mb-2">Order Not Found</h2>
          <p className="text-gray-500 font-poppins mb-4">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin?tab=orders" className="text-pink-500 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusIndex = statusTimeline.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin?tab=orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-navy-800">{order.order_number}</h1>
              <p className="text-sm text-gray-500 font-poppins">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-poppins font-semibold border ${
              STATUS_COLORS[order.status] || STATUS_COLORS['pending']
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card className="bg-white shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="font-playfair text-lg font-bold text-navy-800">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {statusTimeline.map((step, idx) => (
                    <div key={step.key} className="flex-1 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        idx < statusIndex + (order.status === step.key ? 1 : 0)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx < statusIndex + (order.status === step.key ? 1 : 0) ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <p className={`text-xs mt-2 text-center ${
                        idx <= statusIndex ? 'text-navy-800 font-medium' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-poppins">Update Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-poppins outline-none"
                  >
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-white shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="font-playfair text-lg font-bold text-navy-800">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(order.order_items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product_image && (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-poppins font-medium text-navy-800">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` | Color: ${item.color}`}
                          {item.quantity > 1 && ` | Qty: ${item.quantity}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-poppins font-semibold text-navy-800">₹{item.total_price?.toLocaleString()}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">₹{item.unit_price} each</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="bg-white shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="font-playfair text-lg font-bold text-navy-800">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-poppins font-medium text-navy-800">
                      {order.shipping_address?.full_name || 'Guest'}
                    </p>
                    {order.user_id && (
                      <p className="text-xs text-gray-500">Registered User</p>
                    )}
                  </div>
                </div>
                {order.shipping_address?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {order.shipping_address.phone}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-white shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="font-playfair text-lg font-bold text-navy-800">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="font-poppins text-sm text-gray-600">
                    <p>{order.shipping_address?.address_line1}</p>
                    {order.shipping_address?.address_line2 && (
                      <p>{order.shipping_address.address_line2}</p>
                    )}
                    <p>
                      {order.shipping_address?.city}, {order.shipping_address?.state}{' '}
                      {order.shipping_address?.pincode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="bg-white shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="font-playfair text-lg font-bold text-navy-800">Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-poppins">Method</span>
                  <span className="font-poppins font-medium text-navy-800 uppercase">
                    {order.payment_method || 'COD'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-poppins">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-poppins font-semibold ${
                    order.payment_status === 'paid'
                      ? 'bg-emerald-100 text-emerald-600'
                      : order.payment_status === 'failed'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-600'
                  }`}>
                    {order.payment_status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-poppins">Subtotal</span>
                    <span className="font-poppins text-navy-800">₹{order.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-poppins">Shipping</span>
                    <span className="font-poppins text-navy-800">₹{order.shipping_amount?.toLocaleString()}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-poppins">Discount</span>
                      <span className="font-poppins text-emerald-600">-₹{order.discount_amount?.toLocaleString()}</span>
                    </div>
                  )}
                  <hr className="border-gray-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-navy-800 font-poppins">Total</span>
                    <span className="font-poppins font-bold text-xl text-navy-800">₹{order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
