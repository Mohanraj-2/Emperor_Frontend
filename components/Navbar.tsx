'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { supabase } from '@/lib/supabase';
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Menu,
  X,
  Crown,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';

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
  const cartCount = useCartStore((s) => s.totalItems)();
  const wishlistCount = useWishlistStore((s) => s.count)();
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-navy-800 text-white text-xs text-center py-2 font-poppins">
        Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code <span className="text-pink-400 font-semibold">EMPIRE10</span> for 10% off
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-luxury' : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-navy-800 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-pink-400" />
              </div>
              <div className="leading-tight">
                <div className="font-playfair font-bold text-navy-800 text-lg tracking-wide leading-none">EMPIRE</div>
                <div className="font-poppins text-[9px] text-pink-500 tracking-[0.2em] uppercase leading-none">— LIFESTYLE —</div>
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
                <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
                        setSearchOpen(false);
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                    placeholder="Search products..."
                    className="bg-transparent text-sm outline-none w-40 font-poppins text-navy-800"
                  />
                  <button onClick={() => setSearchOpen(false)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-navy-800 hover:text-pink-500 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              <Link href="/wishlist" className="p-2 text-navy-800 hover:text-pink-500 transition-colors relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-400 text-navy-800 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/admin" className="p-2 text-navy-800 hover:text-pink-500 transition-colors" title="Admin Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </Link>

              <Link href="/auth/login" className="p-2 text-navy-800 hover:text-pink-500 transition-colors">
                <User className="w-5 h-5" />
              </Link>

              <Link href="/cart" className="relative p-2 text-navy-800 hover:text-pink-500 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-navy-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-navy-800"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm"
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
