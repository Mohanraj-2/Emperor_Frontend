'use client';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const badgeClass =
    product.badge === 'NEW'
      ? 'badge-new'
      : product.badge === 'SALE'
      ? 'badge-sale'
      : product.badge === 'BESTSELLER'
      ? 'badge-bestseller'
      : '';

  return (
    <div className="card-luxury group relative overflow-hidden">
      {/* Image */}
      <Link href={`/shop/${product.slug}`}>
        <div className="product-img-zoom relative aspect-square bg-gray-50 rounded-t-2xl overflow-hidden">
          <img
            src={product.image_url || 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className={`absolute top-3 left-3 ${badgeClass}`}>
              {product.badge}
            </span>
          )}
          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-pink-500/95 py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product, 1, null, null);
              }}
              className="flex items-center gap-2 text-white text-xs font-poppins font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        </div>
      </Link>

      {/* Wishlist */}
      <button
        onClick={() => toggle(product)}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Info */}
      <div className="p-4">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-poppins font-medium text-gray-800 text-sm leading-snug hover:text-pink-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1 mb-2">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-poppins text-gray-500">
            {product.rating} ({product.review_count})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-poppins font-bold text-gray-800 text-base">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span className="font-poppins text-xs text-gray-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.original_price && (
            <span className="text-xs font-poppins text-pink-600 font-medium">
              {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
            </span>
          )}
        </div>
        <Link href={`/shop/${product.slug}`} className="mt-3 block">
          <span className="text-xs font-poppins text-pink-500 font-medium hover:text-pink-600 transition-colors">
            Shop Now →
          </span>
        </Link>
      </div>
    </div>
  );
}
