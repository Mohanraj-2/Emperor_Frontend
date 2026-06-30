'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, MoreHorizontal, Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  orderAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const sampleOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'EL-A7F9B2C1',
    customerName: 'Rahul Sharma',
    orderAmount: 2499,
    status: 'delivered',
    date: '2024-01-15',
  },
  {
    id: '2',
    orderNumber: 'EL-B3E8D4A2',
    customerName: 'Priya Patel',
    orderAmount: 1899,
    status: 'shipped',
    date: '2024-01-15',
  },
  {
    id: '3',
    orderNumber: 'EL-C1F7E3B4',
    customerName: 'Amit Kumar',
    orderAmount: 3299,
    status: 'processing',
    date: '2024-01-14',
  },
  {
    id: '4',
    orderNumber: 'EL-D2G6F5C3',
    customerName: 'Sneha Gupta',
    orderAmount: 899,
    status: 'pending',
    date: '2024-01-14',
  },
  {
    id: '5',
    orderNumber: 'EL-E3H5G4D5',
    customerName: 'Vikram Singh',
    orderAmount: 4499,
    status: 'delivered',
    date: '2024-01-13',
  },
];

interface RecentOrdersTableProps {
  orders?: Order[];
  showAll?: boolean;
}

export default function RecentOrdersTable({ orders, showAll = false }: RecentOrdersTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const [page, setPage] = useState(1);

  const displayOrders = orders || sampleOrders;

  const filteredOrders = displayOrders.filter((order) => {
    const matchesSearch = search === '' ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  const handleViewOrder = (orderNumber: string) => {
    window.location.href = `/admin/orders/${orderNumber}`;
  };

  return (
    <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-playfair font-bold text-navy-800">
              Recent Orders
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-navy-800/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-navy-800" />
            </div>
          </div>
          <Link href="/admin?tab=orders" className="text-navy-800 hover:bg-navy-800/10 font-medium text-sm px-4 py-2 rounded-lg transition-colors">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Filters */}
        {showAll && (
          <div className="px-6 pb-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-navy-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value as any); setPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none capitalize"
              >
                <option value="all">All Status</option>
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-t border-gray-100">
                <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Order ID
                </TableHead>
                <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Customer
                </TableHead>
                <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Amount
                </TableHead>
                <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wider text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => handleViewOrder(order.orderNumber)}
                >
                  <TableCell className="font-semibold text-navy-800">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-gray-700">{order.customerName}</TableCell>
                  <TableCell className="font-semibold text-navy-800">
                    ₹{order.orderAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${statusStyles[order.status]} font-medium capitalize px-3 py-1 rounded-full`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg hover:bg-navy-800/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order.orderNumber);
                        }}
                      >
                        <Eye className="w-4 h-4 text-navy-800" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-poppins text-gray-400">No orders found</p>
                    {(search || filter !== 'all') && (
                      <button
                        onClick={() => { setSearch(''); setFilter('all'); }}
                        className="mt-2 text-sm text-pink-500 hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-poppins">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 px-2">{page} / {totalPages}</span>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
