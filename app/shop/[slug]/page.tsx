'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { Product, ProductVariant } from '@/lib/types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Shield,
  Truck,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Crown,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*, categories(*), product_variants(*), product_images(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (!data) { router.push('/shop'); return; }
      setProduct(data as Product);
      setVariants(data.product_variants || []);

      const uniqueColors = Array.from(new Set((data.product_variants || []).map((v: ProductVariant) => v.color).filter(Boolean)));
      if (uniqueColors.length > 0) setSelectedColor(uniqueColors[0] as string);

      const { data: rel } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('category_id', data.category_id)
        .neq('id', data.id)
        .limit(4);
      setRelated(rel as Product[] || []);
      setLoading(false);
    })();
  }, [slug, router]);

  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[];
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[];
  const colorMap: Record<string, string> = {};
  variants.forEach((v) => { if (v.color && v.color_hex) colorMap[v.color] = v.color_hex; });

  const productImages = [
    product?.image_url,
    'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/5255548/pexels-photo-5255548.jpeg?auto=compress&cs=tinysrgb&w=600',
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              {[80, 60, 40, 100, 60].map((w, i) => (
                <div key={i} className={`h-6 bg-gray-100 rounded-full animate-pulse`} style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="font-poppins text-xs text-gray-400">
          <Link href="/" className="hover:text-navy-800">Home</Link>
          {' › '}
          <Link href="/shop" className="hover:text-navy-800">Shop</Link>
          {' › '}
          <span className="text-navy-800">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="flex gap-4">
            <div className="hidden sm:flex flex-col gap-3">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImg === i ? 'border-navy-800' : 'border-gray-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-50">
              <img
                src={productImages[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 ${
                  product.badge === 'NEW' ? 'badge-new' :
                  product.badge === 'BESTSELLER' ? 'badge-bestseller' : 'badge-sale'
                }`}>
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => setActiveImg((i) => Math.max(0, i - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-navy-800" />
              </button>
              <button
                onClick={() => setActiveImg((i) => Math.min(productImages.length - 1, i + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-navy-800" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-poppins text-xs text-pink-500 font-semibold uppercase tracking-wider mb-1">
                  {(product as any).categories?.name}
                </p>
                <h1 className="font-playfair text-3xl font-bold text-navy-800">{product.name}</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(product)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-pink-400 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-navy-400 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="font-poppins text-xs text-gray-500">{product.rating} ({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-playfair text-3xl font-bold text-navy-800">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price && (
                <>
                  <span className="font-poppins text-lg text-gray-400 line-through">
                    ₹{product.original_price.toLocaleString('en-IN')}
                  </span>
                  <span className="badge-new">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Size */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-poppins font-semibold text-sm text-navy-800">Size</span>
                  <button className="text-xs text-pink-500 font-poppins hover:underline">Size Guide</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-10 rounded-lg border-2 text-sm font-poppins font-medium transition-all ${
                        selectedSize === s
                          ? 'bg-navy-800 text-white border-navy-800'
                          : 'border-gray-200 text-gray-600 hover:border-navy-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {colors.length > 0 && (
              <div className="mb-5">
                <span className="font-poppins font-semibold text-sm text-navy-800 block mb-3">
                  Color: <span className="font-normal text-gray-500">{selectedColor}</span>
                </span>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      style={{ backgroundColor: colorMap[c] || '#ccc' }}
                      className={`w-9 h-9 rounded-full border-4 transition-all ${
                        selectedColor === c ? 'border-navy-800 scale-110' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <span className="font-poppins font-semibold text-sm text-navy-800 block mb-3">Quantity</span>
              <div className="flex items-center gap-0 border border-gray-200 rounded-full w-fit overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-navy-800 hover:bg-gray-50 font-bold"
                >
                  −
                </button>
                <span className="w-12 text-center font-poppins font-medium text-navy-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-navy-800 hover:bg-gray-50 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className="flex-1 btn-navy justify-center py-4 rounded-xl">
                {added ? (
                  <><Check className="w-4 h-4" /> Added!</>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /> ADD TO CART</>
                )}
              </button>
              <button onClick={handleBuyNow} className="flex-1 btn-pink justify-center py-4 rounded-xl">
                <Zap className="w-4 h-4" /> BUY NOW
              </button>
            </div>

            <Link href="/customize" className="w-full btn-outline justify-center py-3 rounded-xl mb-6 block text-center">
              <Crown className="w-4 h-4" /> CUSTOMIZE NOW
            </Link>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-6">
              {[
                { icon: Shield, text: 'Premium 240 GSM Cotton' },
                { icon: Zap, text: 'Unisex Regular Fit' },
                { icon: Check, text: 'High Quality Print' },
                { icon: Truck, text: '7 Days Easy Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-pink-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3 h-3 text-pink-500" />
                  </div>
                  <span className="font-poppins text-xs text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            {product.description && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="font-poppins font-semibold text-sm text-navy-800 mb-2">Description</h3>
                <p className="font-poppins text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="section-heading mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
