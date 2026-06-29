'use client';
import Link from 'next/link';
import { Crown, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-white">
      {/* Newsletter */}
      <div className="border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-1">Stay in the Empire</h3>
            <p className="text-navy-200 text-sm font-poppins">Be the first to know about new arrivals &amp; offers.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-0 w-full max-w-md"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-full bg-navy-700 border border-navy-600 text-white placeholder-navy-300 text-sm font-poppins outline-none focus:border-pink-400 transition-colors"
            />
            <button className="bg-pink-400 text-navy-800 px-6 py-3 rounded-r-full font-poppins font-semibold text-sm hover:bg-pink-500 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-pink-400 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-navy-800" />
              </div>
              <div className="leading-tight">
                <div className="font-playfair font-bold text-white text-lg tracking-wide leading-none">EMPIRE</div>
                <div className="font-poppins text-[9px] text-pink-400 tracking-[0.2em] uppercase leading-none">— LIFESTYLE —</div>
              </div>
            </Link>
            <p className="text-navy-300 text-sm font-poppins leading-relaxed mb-6 max-w-xs">
              Empire Lifestyle is more than a brand. It&apos;s a statement. Built for those who create their own empire.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-navy-600 flex items-center justify-center text-navy-300 hover:border-pink-400 hover:text-pink-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-4 text-white">Shop</h4>
            <ul className="space-y-2">
              {['All Products', 'T-Shirts', 'Hoodies', 'Jewellery', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-navy-300 text-sm font-poppins hover:text-pink-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-4 text-white">Customer Care</h4>
            <ul className="space-y-2">
              {['Track Order', 'Shipping & Delivery', 'Returns & Refunds', 'FAQs', 'Size Guide'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-navy-300 text-sm font-poppins hover:text-pink-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-4 text-white">About</h4>
            <ul className="space-y-2">
              {['Our Story', 'Careers', 'Privacy Policy', 'Terms & Conditions', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-navy-300 text-sm font-poppins hover:text-pink-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy-400 text-xs font-poppins">© 2025 Empire Lifestyle. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['VISA', 'MC', 'PayPal', 'UPI'].map((pm) => (
              <span key={pm} className="text-navy-400 text-xs font-poppins font-semibold border border-navy-600 px-2 py-1 rounded">
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
