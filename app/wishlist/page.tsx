'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/lib/wishlistContext';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-playfair text-3xl font-bold text-white flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-400" />
            My Wishlist
          </h1>
          <p className="font-poppins text-navy-200 text-sm mt-1">{items.length} items saved</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-pink-300" />
            </div>
            <h3 className="font-playfair text-2xl text-navy-800 mb-3">Your wishlist is empty</h3>
            <p className="font-poppins text-gray-500 text-sm mb-8">Save items you love and find them here.</p>
            <Link href="/shop" className="btn-navy text-sm px-8 py-4 rounded-full">
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
