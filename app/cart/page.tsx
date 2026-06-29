'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cartContext';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SHIPPING = 99;
const FREE_SHIPPING_THRESHOLD = 999;

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const router = useRouter();

  const sub = subtotal;
  const shippingCost = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING;
  const total = sub - discount + shippingCost;

  const applyCoupon = async () => {
    setCouponLoading(true);
    setCouponMsg('');
    setCouponError('');
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase().trim())
      .eq('is_active', true)
      .maybeSingle();

    if (!data) {
      setCouponError('Invalid or expired coupon code.');
      setCouponLoading(false);
      return;
    }
    if (data.min_order_amount && sub < data.min_order_amount) {
      setCouponError(`Minimum order ₹${data.min_order_amount} required.`);
      setCouponLoading(false);
      return;
    }
    const d = data.discount_type === 'percentage'
      ? Math.round((sub * data.discount_value) / 100)
      : data.discount_value;
    setDiscount(d);
    setCouponMsg(`Coupon applied! You saved ₹${d}`);
    setCouponLoading(false);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-pink-400" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="font-poppins text-gray-500 text-base mb-8">Add some products to your cart and come back here.</p>
          <Link href="/shop" className="btn-navy text-sm px-8 py-4 rounded-full">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-playfair text-3xl font-bold text-white">Your Cart</h1>
          <p className="font-poppins text-gray-300 text-sm mt-1">
            {items.reduce((s, i) => s + i.quantity, 0)} items
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="bg-white rounded-2xl shadow-card p-5 flex gap-4">
                <div className="w-24 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img
                    src={item.product.image_url || ''}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-poppins font-semibold text-gray-900 text-sm leading-snug">{item.product.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {item.size && (
                          <span className="font-poppins text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="font-poppins text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                            Color: {item.color}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-0 border border-gray-200 rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-900 hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-poppins text-sm font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-900 hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-poppins font-bold text-gray-900 text-base">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      {item.quantity > 1 && (
                        <div className="font-poppins text-xs text-gray-400">
                          ₹{item.product.price.toLocaleString('en-IN')} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-poppins font-semibold text-gray-900 text-base mb-5">PRICE DETAILS</h3>

              {/* Coupon */}
              <div className="mb-5">
                <label className="font-poppins text-xs text-gray-500 mb-2 block flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Apply Coupon Code
                </label>
                <div className="flex gap-0 overflow-hidden rounded-full border border-gray-200">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2.5 text-xs font-poppins outline-none text-gray-900 bg-transparent"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="bg-gray-900 text-white px-4 py-2.5 text-xs font-poppins font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    APPLY
                  </button>
                </div>
                {couponMsg && <p className="text-green-600 text-xs font-poppins mt-1">{couponMsg}</p>}
                {couponError && <p className="text-red-500 text-xs font-poppins mt-1">{couponError}</p>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['EMPIRE10', 'WELCOME20', 'FLAT200'].map((code) => (
                    <button
                      key={code}
                      onClick={() => setCouponCode(code)}
                      className="text-[10px] font-poppins font-semibold bg-pink-50 text-pink-600 px-2 py-1 rounded-full border border-pink-200 hover:bg-pink-100 transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="font-poppins text-sm text-gray-600">Subtotal</span>
                  <span className="font-poppins text-sm font-medium text-gray-900">₹{sub.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-poppins text-sm text-gray-600">Shipping</span>
                  <span className={`font-poppins text-sm font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="font-poppins text-sm text-green-600">Discount</span>
                    <span className="font-poppins text-sm font-medium text-green-600">−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="font-poppins font-bold text-gray-900">Total</span>
                  <span className="font-playfair font-bold text-gray-900 text-xl">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {sub < FREE_SHIPPING_THRESHOLD && (
                <div className="mt-4 bg-pink-50 rounded-xl p-3">
                  <p className="font-poppins text-xs text-pink-600 text-center">
                    Add ₹{(FREE_SHIPPING_THRESHOLD - sub).toLocaleString('en-IN')} more for free shipping!
                  </p>
                </div>
              )}

              <Link href="/checkout" className="btn-navy w-full justify-center py-4 rounded-xl mt-5 block text-center">
                PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
              </Link>

              <Link href="/shop" className="font-poppins text-xs text-center text-gray-400 hover:text-gray-900 transition-colors mt-4 block">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
