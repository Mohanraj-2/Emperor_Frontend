'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  AlertTriangle,
  Search,
  ArrowLeft,
  Warehouse,
  Filter,
  Download,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [pRes, vRes] = await Promise.all([
      supabase.from('products').select('*, categories(*)').order('name'),
      supabase.from('product_variants').select('*, products(name)').order('stock_quantity'),
    ]);
    setProducts(pRes.data || []);
    setVariants(vRes.data || []);
    setLoading(false);
  };

  // Calculate stock from variants
  const inventoryData = variants.map(v => ({
    id: v.id,
    productId: v.product_id,
    product: v.products?.name || 'Unknown Product',
    sku: v.sku || `${v.product_id?.slice(0, 8)}-${v.size}-${v.color}`,
    size: v.size || 'N/A',
    color: v.color || 'N/A',
    stock: v.stock_quantity,
    status: v.stock_quantity === 0 ? 'out' : v.stock_quantity < 10 ? 'low' : 'ok',
  }));

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(search.toLowerCase()) ||
                          item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
                          (filter === 'low' && item.status === 'low') ||
                          (filter === 'out' && item.status === 'out');
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = inventoryData.filter(i => i.status === 'low').length;
  const outOfStockCount = inventoryData.filter(i => i.status === 'out').length;
  const totalStock = inventoryData.reduce((sum, i) => sum + i.stock, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin?tab=inventory" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-navy-800">Inventory Management</h1>
              <p className="text-sm text-gray-500 font-poppins">
                Track stock levels and manage product variants
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center">
                  <Warehouse className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Total Variants</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">{inventoryData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Total Stock</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">{totalStock.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Low Stock</p>
                  <p className="text-2xl font-playfair font-bold text-amber-600">{lowStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Out of Stock</p>
                  <p className="text-2xl font-playfair font-bold text-red-600">{outOfStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or SKU..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
              {[
                { value: 'all', label: 'All' },
                { value: 'low', label: 'Low Stock' },
                { value: 'out', label: 'Out of Stock' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value as any)}
                  className={`px-3 py-1.5 rounded-md text-sm font-poppins transition-colors ${
                    filter === f.value
                      ? 'bg-navy-800 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-3 border-navy-800 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filteredData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'SKU', 'Size', 'Color', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-6 py-4 font-poppins text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-poppins font-medium text-navy-800">{item.product}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-600">{item.sku}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.color}</td>
                    <td className="px-6 py-4">
                      <span className={`font-poppins font-bold ${
                        item.status === 'out' ? 'text-red-600' :
                        item.status === 'low' ? 'text-amber-600' : 'text-navy-800'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-poppins font-semibold ${
                        item.status === 'out'
                          ? 'text-red-600 bg-red-50 border border-red-200'
                          : item.status === 'low'
                            ? 'text-amber-600 bg-amber-50 border border-amber-200'
                            : 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                      }`}>
                        {item.status === 'out' ? 'Out of Stock' : item.status === 'low' ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                        Update <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-16 text-center">
              <Warehouse className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-playfair text-lg font-bold text-navy-800 mb-2">No inventory data</h3>
              <p className="text-gray-500 font-poppins">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
