'use client';
import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'newest', label: 'Newest First' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    supabase.from('categories').select('*').order('display_order').then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, priceRange, page, search]);

  async function fetchProducts() {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*, categories(*)', { count: 'exact' })
      .eq('is_active', true)
      .gte('price', priceRange[0])
      .lte('price', priceRange[1])
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (search) query = query.ilike('name', `%${search}%`);
    if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false });
    else if (sortBy === 'rating') query = query.order('rating', { ascending: false });
    else if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
    else if (sortBy === 'bestseller') query = query.eq('is_bestseller', true);
    else if (sortBy === 'new') query = query.eq('is_new_arrival', true).order('created_at', { ascending: false });
    else query = query.order('is_featured', { ascending: false });

    const { data, count } = await query;
    setProducts(data as Product[] || []);
    setTotal(count || 0);
    setLoading(false);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Page header */}
      <div className="bg-navy-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="font-poppins text-xs text-navy-300 mb-3">
            Home &rsaquo; Shop {selectedCategory && <>&rsaquo; <span className="capitalize">{selectedCategory}</span></>}
          </nav>
          <h1 className="font-playfair text-4xl font-bold text-white">
            {selectedCategory ? <span className="capitalize">{selectedCategory}</span> : 'All Products'}
          </h1>
          <p className="font-poppins text-navy-200 text-sm mt-2">Showing {total} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm font-poppins outline-none focus:border-navy-400 text-gray-800"
            />
          </div>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 text-sm font-poppins font-medium text-navy-800 hover:border-navy-400 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-poppins text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-full px-3 py-2 text-sm font-poppins outline-none text-navy-800 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${view === 'grid' ? 'bg-navy-800 text-white' : 'text-gray-400 hover:text-navy-800'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${view === 'list' ? 'bg-navy-800 text-white' : 'text-gray-400 hover:text-navy-800'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              filtersOpen ? 'block' : 'hidden lg:block'
            } w-60 flex-shrink-0`}
          >
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-semibold text-navy-800 text-sm">FILTERS</h3>
                {(selectedCategory || selectedSizes.length > 0) && (
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedSizes([]); setPage(1); }}
                    className="text-xs text-pink-500 font-poppins font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-poppins font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cat"
                      checked={selectedCategory === ''}
                      onChange={() => { setSelectedCategory(''); setPage(1); }}
                      className="accent-navy-800"
                    />
                    <span className="font-poppins text-sm text-gray-700">All</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cat"
                        checked={selectedCategory === cat.slug}
                        onChange={() => { setSelectedCategory(cat.slug); setPage(1); }}
                        className="accent-navy-800"
                      />
                      <span className="font-poppins text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-poppins font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-poppins text-gray-500">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange[1]}
                    onChange={(e) => { setPriceRange([priceRange[0], Number(e.target.value)]); setPage(1); }}
                    className="w-full accent-navy-800"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="font-poppins font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSizes((prev) =>
                          prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                        );
                        setPage(1);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-poppins border transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-navy-800 text-white border-navy-800'
                          : 'border-gray-200 text-gray-600 hover:border-navy-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-gray-100 aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="font-playfair text-2xl text-navy-800 mb-2">No products found</h3>
                <p className="font-poppins text-gray-500 text-sm">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-navy-800 disabled:opacity-40 hover:border-navy-800 transition-colors"
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-full text-sm font-poppins font-medium border transition-colors ${
                          page === p
                            ? 'bg-navy-800 text-white border-navy-800'
                            : 'border-gray-200 text-navy-800 hover:border-navy-800'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-navy-800 disabled:opacity-40 hover:border-navy-800 transition-colors"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
