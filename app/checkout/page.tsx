'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/useCartStore';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, CreditCard, Smartphone, Banknote, Crown, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const schema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  address_line1: z.string().min(5, 'Address required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
});
type FormData = z.infer<typeof schema>;

const PAYMENT_METHODS = [
  { id: 'card', icon: CreditCard, label: 'Credit / Debit Card' },
  { id: 'upi', icon: Smartphone, label: 'UPI' },
  { id: 'cod', icon: Banknote, label: 'Cash on Delivery' },
];

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { items, subtotal, clearCart } = useCartStore();
  const router = useRouter();

  const sub = subtotal();
  const shipping = sub >= 999 ? 0 : 99;
  const total = sub + shipping;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const addr = getValues();
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          subtotal: sub,
          shipping_amount: shipping,
          total,
          payment_method: paymentMethod,
          shipping_address: addr,
        })
        .select()
        .single();

      if (error || !order) throw new Error(error?.message || 'Order failed');

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }));

      await supabase.from('order_items').insert(orderItems);
      setOrderNumber(order.order_number);
      clearCart();
      setStep(2);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  useEffect(() => {
    if (items.length === 0 && step < 2) {
      router.push('/cart');
    }
  }, [items.length, step, router]);

  if (items.length === 0 && step < 2) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-navy-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-playfair text-3xl font-bold text-white mb-4">Checkout</h1>
          {/* Steps */}
          <div className="flex items-center gap-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-poppins font-bold ${
                  i <= step ? 'bg-pink-400 text-navy-800' : 'bg-navy-600 text-navy-300'
                }`}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className={`font-poppins text-xs font-medium ${i <= step ? 'text-white' : 'text-navy-400'}`}>{s}</span>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-navy-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Step 0: Shipping */}
        {step === 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit(() => setStep(1))} className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-poppins font-semibold text-navy-800 text-base mb-5">SHIPPING DETAILS</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'full_name', label: 'Full Name', placeholder: 'Rahul Sharma', colSpan: 1 },
                    { name: 'phone', label: 'Phone Number', placeholder: '9876543210', colSpan: 1 },
                    { name: 'address_line1', label: 'Address Line 1', placeholder: '123, Empire Street', colSpan: 2 },
                    { name: 'address_line2', label: 'Address Line 2 (optional)', placeholder: 'Near Park', colSpan: 2 },
                    { name: 'city', label: 'City', placeholder: 'Mumbai', colSpan: 1 },
                    { name: 'state', label: 'State', placeholder: 'Maharashtra', colSpan: 1 },
                    { name: 'pincode', label: 'Pincode', placeholder: '400001', colSpan: 1 },
                  ].map(({ name, label, placeholder, colSpan }) => (
                    <div key={name} className={colSpan === 2 ? 'sm:col-span-2' : ''}>
                      <label className="font-poppins text-xs text-gray-500 mb-1.5 block">{label}</label>
                      <input
                        {...register(name as keyof FormData)}
                        placeholder={placeholder}
                        className={`w-full border rounded-xl px-4 py-3 text-sm font-poppins outline-none transition-colors ${
                          errors[name as keyof FormData] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-navy-400'
                        }`}
                      />
                      {errors[name as keyof FormData] && (
                        <p className="text-red-500 text-xs font-poppins mt-1">{errors[name as keyof FormData]?.message}</p>
                      )}
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn-navy mt-6 px-8 py-3 rounded-xl justify-center w-full">
                  Continue to Payment <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
            <OrderSummary items={items} sub={sub} shipping={shipping} total={total} />
          </div>
        )}

        {/* Step 1: Payment */}
        {step === 1 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-poppins font-semibold text-navy-800 text-base mb-5">PAYMENT METHOD</h2>
                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map(({ id, icon: Icon, label }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === id ? 'border-navy-800 bg-navy-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)}
                        className="accent-navy-800"
                      />
                      <Icon className="w-5 h-5 text-navy-800" />
                      <span className="font-poppins font-medium text-navy-800 text-sm">{label}</span>
                      {id === 'cod' && (
                        <span className="ml-auto text-xs font-poppins text-gray-400">+₹0 charge</span>
                      )}
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Card Number</label>
                      <input placeholder="1234 5678 9012 3456" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-poppins outline-none focus:border-navy-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Expiry</label>
                        <input placeholder="MM / YY" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-poppins outline-none focus:border-navy-400" />
                      </div>
                      <div>
                        <label className="font-poppins text-xs text-gray-500 mb-1.5 block">CVV</label>
                        <input placeholder="•••" type="password" maxLength={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-poppins outline-none focus:border-navy-400" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="border-t border-gray-100 pt-4">
                    <label className="font-poppins text-xs text-gray-500 mb-1.5 block">UPI ID</label>
                    <input placeholder="yourname@upi" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-poppins outline-none focus:border-navy-400" />
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(0)}
                    className="btn-outline px-6 py-3 rounded-xl text-sm"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="flex-1 btn-pink justify-center py-3 rounded-xl text-sm"
                  >
                    {placing ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : 'CONTINUE TO PAYMENT'}
                  </button>
                </div>
              </div>
            </div>
            <OrderSummary items={items} sub={sub} shipping={shipping} total={total} />
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-luxury p-10">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <Crown className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-3">Thank You!</h2>
              <p className="font-poppins text-gray-500 text-sm mb-6">Your order has been placed successfully.</p>
              <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="font-poppins text-xs text-gray-500">Order Number</span>
                  <span className="font-poppins font-bold text-navy-800 text-sm">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-poppins text-xs text-gray-500">Total Paid</span>
                  <span className="font-poppins font-bold text-navy-800 text-sm">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-poppins text-xs text-gray-500">Delivery</span>
                  <span className="font-poppins font-medium text-green-600 text-sm">5-7 business days</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 btn-outline py-3 rounded-xl text-sm"
                >
                  View Orders
                </button>
                <button
                  onClick={() => router.push('/shop')}
                  className="flex-1 btn-navy justify-center py-3 rounded-xl text-sm"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

function OrderSummary({ items, sub, shipping, total }: { items: any[]; sub: number; shipping: number; total: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h3 className="font-poppins font-semibold text-navy-800 text-sm mb-4">ORDER SUMMARY</h3>
      <div className="space-y-3 mb-4">
        {items.map((item: any) => (
          <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
              <img src={item.product.image_url || ''} alt={item.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-poppins text-xs font-medium text-navy-800 truncate">{item.product.name}</p>
              <p className="font-poppins text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <span className="font-poppins text-xs font-semibold text-navy-800">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-poppins text-xs text-gray-500">Subtotal</span>
          <span className="font-poppins text-xs text-navy-800">₹{sub.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-poppins text-xs text-gray-500">Shipping</span>
          <span className={`font-poppins text-xs ${shipping === 0 ? 'text-green-600' : 'text-navy-800'}`}>
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <span className="font-poppins font-bold text-navy-800 text-sm">Total</span>
          <span className="font-playfair font-bold text-navy-800 text-lg">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
