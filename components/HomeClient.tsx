'use client';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Truck, RefreshCcw, Zap, Package, ChevronRight, Crown } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product, Category } from '@/lib/types';

interface Props {
  featured: Product[];
  bestsellers: Product[];
  newArrivals: Product[];
  categories: Category[];
}

const categoryImages: Record<string, string> = {
  't-shirts': 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
  'hoodies': 'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=400',
  'jewellery': 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
  'accessories': 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
  'caps': 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg?auto=compress&cs=tinysrgb&w=400',
};

const testimonials = [
  { name: 'Priya S.', rating: 5, text: 'Absolutely love the quality! The fabric is so premium and the print is crisp. Empire Lifestyle has become my go-to brand.', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80', city: 'Mumbai' },
  { name: 'Rahul M.', rating: 5, text: 'Ordered the custom design tee for my startup. The quality exceeded expectations. Fast delivery and great packaging!', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80', city: 'Bangalore' },
  { name: 'Anjali K.', rating: 5, text: 'The gold pendant is stunning! Everyone keeps asking where I got it. The packaging is beautiful too.', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80', city: 'Delhi' },
];

const features = [
  { icon: Shield, label: 'Premium Quality', sub: 'Finest Materials' },
  { icon: Zap, label: 'Custom Made', sub: 'Design it your way' },
  { icon: Truck, label: 'Fast Delivery', sub: 'At your doorstep' },
  { icon: Package, label: 'Secure Payment', sub: '100% Safe & Secure' },
  { icon: RefreshCcw, label: 'Easy Returns', sub: '7 Days Easy Returns' },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Custom Designs' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '24/7', label: 'Customer Support' },
];

export default function HomeClient({ featured, bestsellers, newArrivals, categories }: Props) {
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'T-Shirts', slug: 't-shirts', description: null, image_url: null, display_order: 1, created_at: '' },
    { id: '2', name: 'Hoodies', slug: 'hoodies', description: null, image_url: null, display_order: 2, created_at: '' },
    { id: '3', name: 'Jewellery', slug: 'jewellery', description: null, image_url: null, display_order: 3, created_at: '' },
    { id: '4', name: 'Accessories', slug: 'accessories', description: null, image_url: null, display_order: 4, created_at: '' },
    { id: '5', name: 'Caps', slug: 'caps', description: null, image_url: null, display_order: 5, created_at: '' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full bg-pink-400/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-pink-300/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10 py-20">
          {/* Left content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-pink-300 text-xs font-poppins font-medium px-4 py-2.5 rounded-full mb-6 border border-pink-500/30">
              <Crown className="w-3.5 h-3.5" />
              PREMIUM APPAREL. CUSTOM PRINTING.
            </div>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-white leading-tight mb-4">
              WEAR YOUR<br />
              <span className="text-pink-400 italic">STORY.</span>
            </h1>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-pink-400 italic leading-tight mb-6">
              LIVE LIKE AN EMPIRE.
            </h2>
            <p className="font-poppins text-gray-300 text-base leading-relaxed mb-8 max-w-md">
              Luxury is not about brands.<br />
              It&apos;s about the lifestyle you build.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-pink text-sm font-semibold px-9 py-4 shadow-pink">
                SHOP NOW <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/customize" className="btn-outline border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white text-sm font-semibold px-9 py-4">
                CUSTOMIZE NOW →
              </Link>
            </div>

            {/* Hero stats */}
            <div className="flex items-center gap-10 mt-14">
              {[['5K+', 'Products'], ['4.9', 'Rating'], ['48hr', 'Delivery']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-playfair font-bold text-2xl text-white">{v}</div>
                  <div className="font-poppins text-xs text-gray-400">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – hero image */}
          <div className="hidden lg:block relative">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-transparent rounded-3xl blur-xl" />
              <img
                src="https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Empire Lifestyle Fashion"
                className="w-full h-[520px] object-cover rounded-3xl shadow-2xl relative z-10"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-luxury p-5 flex items-center gap-4 z-20">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <div className="font-poppins font-bold text-gray-800 text-sm">Premium Quality</div>
                  <div className="font-poppins text-xs text-gray-400">240 GSM Cotton</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-pink-500 rounded-2xl shadow-luxury p-4 text-center z-20">
                <div className="font-playfair font-bold text-white text-xl">4.9★</div>
                <div className="font-poppins text-xs text-pink-100">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-pink-500" />
                </div>
                <div>
                  <div className="font-poppins font-semibold text-xs text-gray-800">{label}</div>
                  <div className="font-poppins text-xs text-gray-400">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-poppins text-xs text-pink-500 font-semibold uppercase tracking-wider mb-1">Discover</p>
            <h2 className="section-heading">Explore Our Collections</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-1 text-gray-600 text-sm font-poppins font-medium hover:text-pink-500 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <img
                src={categoryImages[cat.slug] || cat.image_url || ''}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-playfair font-bold text-white text-lg leading-tight">{cat.name}</h3>
                <p className="font-poppins text-xs text-pink-300 mt-1">Shop Now →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      {bestsellers.length > 0 && (
        <section className="bg-pink-50/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-poppins text-xs text-pink-500 font-semibold uppercase tracking-wider mb-1">Top Picks</p>
                <h2 className="section-heading">Best Sellers</h2>
              </div>
              <Link href="/shop?sort=bestseller" className="flex items-center gap-1 text-gray-600 text-sm font-poppins font-medium hover:text-pink-500 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {bestsellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="bg-gray-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-pink-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-pink-400/20 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-new mb-4 inline-block">Limited Time Offer</span>
              <h2 className="font-playfair text-4xl font-bold text-white mb-4">
                Design Your Own<br />
                <span className="text-pink-400 italic">Empire T-Shirt</span>
              </h2>
              <p className="font-poppins text-gray-300 text-base mb-8 max-w-md">
                Upload your logo, add custom text, choose colors — and wear your brand with pride. Perfect for businesses, teams, and events.
              </p>
              <Link href="/customize" className="btn-pink text-sm font-semibold px-8 py-4 shadow-pink">
                Start Designing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:flex items-center justify-center gap-6">
              {['FRONT', 'BACK'].map((side) => (
                <div key={side} className="relative">
                  <div className="w-40 h-48 bg-white/5 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-pink-500/20 shadow-2xl">
                    <div className="text-pink-400 text-xs font-poppins font-bold mb-3 tracking-wider">{side}</div>
                    <div className="w-24 h-28 bg-white/5 border border-dashed border-pink-400/40 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <Crown className="w-6 h-6 text-pink-400 mx-auto mb-1" />
                        <div className="font-playfair text-white text-xs font-bold">YOUR</div>
                        <div className="font-playfair text-pink-300 text-xs">DESIGN</div>
                        <div className="font-playfair text-white text-xs font-bold">HERE</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-poppins text-xs text-pink-500 font-semibold uppercase tracking-wider mb-1">Fresh In</p>
              <h2 className="section-heading">New Arrivals</h2>
            </div>
            <Link href="/shop?sort=new" className="flex items-center gap-1 text-gray-600 text-sm font-poppins font-medium hover:text-pink-500 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="bg-pink-50 border-t border-pink-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-playfair text-4xl font-bold text-pink-600 mb-1">{value}</div>
                <div className="font-poppins text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="font-poppins text-xs text-pink-500 font-semibold uppercase tracking-wider mb-2">What They Say</p>
          <h2 className="section-heading">Customer Love</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-luxury p-6">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-poppins text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-poppins font-semibold text-gray-800 text-sm">{t.name}</div>
                  <div className="font-poppins text-xs text-gray-400">{t.city}</div>
                </div>
                <div className="ml-auto">
                  <div className="w-6 h-6 bg-pink-50 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-pink-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
