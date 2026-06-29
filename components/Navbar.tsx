'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { useWishlist } from '@/lib/wishlistContext';
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Menu,
  X,
  Crown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Customize', href: '/customize' },
  { label: 'Collections', href: '/shop?sort=featured' },
  { label: 'Jewellery', href: '/shop?category=jewellery' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-pink-500 text-white text-xs text-center py-2.5 font-poppins font-medium tracking-wide">
        Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code <span className="font-bold">EMPIRE10</span> for 10% off
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg' : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="font-playfair font-bold text-gray-800 text-lg tracking-wide leading-none">EMPIRE</div>
                <div className="font-poppins text-[9px] text-pink-500 tracking-[0.25em] uppercase leading-none font-medium">— LIFESTYLE —</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link text-xs">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {searchOpen ? (
                <div className="flex items-center bg-pink-50 rounded-full px-4 py-2 border border-pink-200">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchOpen(false);
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                    placeholder="Search products..."
                    className="bg-transparent text-sm outline-none w-40 font-poppins text-gray-800 placeholder-gray-400"
                  />
                  <button onClick={() => setSearchOpen(false)}>
                    <X className="w-4 h-4 text-gray-400 hover:text-pink-500" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 text-gray-600 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              <Link href="/wishlist" className="p-2.5 text-gray-600 hover:text-pink-500 transition-colors relative rounded-full hover:bg-pink-50">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href={user ? '/dashboard' : '/auth/login'}
                className="p-2.5 text-gray-600 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link href="/cart" className="relative p-2.5 text-gray-600 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gray-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 text-gray-600 rounded-full hover:bg-pink-50"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
