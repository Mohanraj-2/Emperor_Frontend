'use client';
import Link from 'next/link';
import { Crown, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-playfair text-2xl font-bold mb-1">Stay in the Empire</h3>
            <p className="text-gray-400 text-sm font-poppins">Be the first to know about new arrivals &amp; offers.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-0 w-full max-w-md"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-l-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm font-poppins outline-none focus:border-pink-400 transition-colors"
            />
            <button className="bg-pink-500 text-white px-7 py-3.5 rounded-r-full font-poppins font-semibold text-sm hover:bg-pink-600 transition-colors shadow-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="font-playfair font-bold text-white text-lg tracking-wide leading-none">EMPIRE</div>
                <div className="font-poppins text-[9px] text-pink-400 tracking-[0.25em] uppercase leading-none font-medium">— LIFESTYLE —</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm font-poppins leading-relaxed mb-7 max-w-xs">
              Empire Lifestyle is more than a brand. It&apos;s a statement. Built for those who create their own empire.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-5 text-white">Shop</h4>
            <ul className="space-y-3">
              {['All Products', 'T-Shirts', 'Hoodies', 'Jewellery', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-gray-400 text-sm font-poppins hover:text-pink-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-5 text-white">Customer Care</h4>
            <ul className="space-y-3">
              {['Track Order', 'Shipping & Delivery', 'Returns & Refunds', 'FAQs', 'Size Guide'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 text-sm font-poppins hover:text-pink-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-5 text-white">About</h4>
            <ul className="space-y-3">
              {['Our Story', 'Careers', 'Privacy Policy', 'Terms & Conditions', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 text-sm font-poppins hover:text-pink-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs font-poppins">© 2025 Empire Lifestyle. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {['VISA', 'MC', 'PayPal', 'UPI'].map((pm) => (
              <span key={pm} className="text-gray-500 text-xs font-poppins font-semibold border border-gray-700 px-3 py-1.5 rounded-md">
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
