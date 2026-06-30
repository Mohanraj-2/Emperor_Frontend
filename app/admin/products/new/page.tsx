'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Package,
  Save,
  Upload,
  X,
  DollarSign,
  Tag,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Category } from '@/lib/types';

export default function AddProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    image_url: '',
    badge: '',
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    material: '',
    care_instructions: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const slug = formData.slug || generateSlug(formData.name);

    const { error } = await supabase.from('products').insert({
      name: formData.name,
      slug,
      description: formData.description || null,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      category_id: formData.category_id || null,
      image_url: formData.image_url || null,
      badge: formData.badge || null,
      is_featured: formData.is_featured,
      is_bestseller: formData.is_bestseller,
      is_new_arrival: formData.is_new_arrival,
      material: formData.material || null,
      care_instructions: formData.care_instructions || null,
      rating: 4.5,
      review_count: 0,
      is_active: true,
    });

    setSaving(false);

    if (!error) {
      router.push('/admin?tab=products');
    } else {
      alert('Error creating product: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center gap-4">
          <Link href="/admin?tab=products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="font-playfair text-2xl font-bold text-navy-800">Add New Product</h1>
            <p className="text-sm text-gray-500 font-poppins">
              Create a new product listing for your store
            </p>
          </div>
        </div>
      </header>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card className="bg-white shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-playfair text-lg font-bold text-navy-800 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData(prev => ({
                          ...prev,
                          name: e.target.value,
                          slug: prev.slug || generateSlug(e.target.value),
                        }));
                      }}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                      placeholder="e.g., Classic Black T-Shirt"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                      Product Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                      placeholder="classic-black-t-shirt"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                      placeholder="Describe your product..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                      Category
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="bg-white shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-playfair text-lg font-bold text-navy-800 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                        placeholder="699"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        name="original_price"
                        value={formData.original_price}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                        placeholder="999"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media */}
              <Card className="bg-white shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-playfair text-lg font-bold text-navy-800 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image_url && (
                      <div className="mt-4 relative inline-block">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-40 h-40 object-cover rounded-xl border border-gray-200"
                          onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish */}
              <Card className="bg-white shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-playfair text-lg font-bold text-navy-800">Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-navy-800 hover:bg-navy-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Product'}
                  </Button>
                </CardContent>
              </Card>

              {/* Badge */}
              <Card className="bg-white shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-playfair text-lg font-bold text-navy-800 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Badge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400"
                  >
                    <option value="">No Badge</option>
                    <option value="NEW">NEW</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="SALE">SALE</option>
                  </select>
                  <div className="mt-4 space-y-3">
                    {[
                      { key: 'is_featured', label: 'Featured Product' },
                      { key: 'is_bestseller', label: 'Bestseller' },
                      { key: 'is_new_arrival', label: 'New Arrival' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name={key}
                          checked={(formData as any)[key]}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-gray-300 accent-navy-800"
                        />
                        <span className="text-sm font-poppins text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card className="bg-white shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-playfair text-lg font-bold text-navy-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                      placeholder="e.g., 100% Cotton"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 font-poppins block mb-2">
                      Care Instructions
                    </label>
                    <textarea
                      name="care_instructions"
                      value={formData.care_instructions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                      placeholder="Machine wash cold, tumble dry low..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
