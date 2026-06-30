'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Star,
  Search,
  Filter,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Check,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

const sampleReviews = [
  {
    id: '1',
    product: 'Classic Black T-Shirt',
    customer: 'Rahul Sharma',
    rating: 5,
    title: 'Amazing quality!',
    comment: 'The fabric quality is excellent. True to size and very comfortable. Will definitely buy again.',
    date: '2024-01-15',
    verified: true,
    helpful: 24,
  },
  {
    id: '2',
    product: 'Oversized Hoodie',
    customer: 'Priya Patel',
    rating: 4,
    title: 'Good but runs large',
    comment: 'Love the hoodie but it runs a bit large. Ordered M but could have gone with S.',
    date: '2024-01-14',
    verified: true,
    helpful: 18,
  },
  {
    id: '3',
    product: 'Gold Pendant',
    customer: 'Amit Kumar',
    rating: 5,
    title: 'Exquisite piece',
    comment: 'The detailing on this pendant is incredible. Worth every rupee!',
    date: '2024-01-13',
    verified: false,
    helpful: 12,
  },
  {
    id: '4',
    product: 'Premium Cap',
    customer: 'Sneha Gupta',
    rating: 3,
    title: 'Average quality',
    comment: 'The cap is okay but the adjustment band feels a bit cheap. Expected better for the price.',
    date: '2024-01-12',
    verified: true,
    helpful: 8,
  },
];

export default function ReviewsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  const filteredReviews = sampleReviews.filter(r => {
    const matchesSearch = r.product.toLowerCase().includes(search.toLowerCase()) ||
                          r.customer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || r.rating.toString() === filter;
    return matchesSearch && matchesFilter;
  });

  const avgRating = sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin?tab=reviews" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-navy-800">Reviews & Ratings</h1>
              <p className="text-sm text-gray-500 font-poppins">
                Manage customer reviews and product ratings
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Avg. Rating</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">{avgRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Total Reviews</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">{sampleReviews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">5-Star Reviews</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">
                    {sampleReviews.filter(r => r.rating === 5).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins">Verified Reviews</p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">
                    {sampleReviews.filter(r => r.verified).length}
                  </p>
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
                placeholder="Search by product or customer..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
              {[
                { value: 'all', label: 'All' },
                { value: '5', label: '5 Stars' },
                { value: '4', label: '4 Stars' },
                { value: '3', label: '3 Stars' },
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

        {/* Reviews Cards */}
        <div className="space-y-6">
          {filteredReviews.length > 0 ? filteredReviews.map((review) => (
            <Card key={review.id} className="bg-white shadow-md rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-poppins font-semibold text-navy-800">{review.product}</h3>
                      {review.verified && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs font-poppins font-medium rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">by {review.customer}</span>
                      <span className="text-sm text-gray-400">{review.date}</span>
                    </div>
                    <h4 className="font-poppins font-medium text-navy-800 mb-1">{review.title}</h4>
                    <p className="text-gray-600 font-poppins text-sm">{review.comment}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        {review.helpful} helpful
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
                        <Flag className="w-4 h-4" />
                        Flag
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="bg-white rounded-2xl shadow-md p-16 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-playfair text-lg font-bold text-navy-800 mb-2">No reviews found</h3>
              <p className="text-gray-500 font-poppins">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
