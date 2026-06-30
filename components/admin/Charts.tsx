'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart3, PieChartIcon } from 'lucide-react';

const revenueDataMap = {
  '7d': [
    { month: 'Mon', revenue: 12000, orders: 32 },
    { month: 'Tue', revenue: 15000, orders: 45 },
    { month: 'Wed', revenue: 11000, orders: 28 },
    { month: 'Thu', revenue: 18000, orders: 52 },
    { month: 'Fri', revenue: 16000, orders: 48 },
    { month: 'Sat', revenue: 21000, orders: 65 },
    { month: 'Sun', revenue: 19000, orders: 58 },
  ],
  '30d': [
    { month: 'Week 1', revenue: 45000, orders: 120 },
    { month: 'Week 2', revenue: 52000, orders: 145 },
    { month: 'Week 3', revenue: 48000, orders: 132 },
    { month: 'Week 4', revenue: 61000, orders: 178 },
  ],
  '12m': [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 132 },
    { month: 'Apr', revenue: 61000, orders: 178 },
    { month: 'May', revenue: 55000, orders: 156 },
    { month: 'Jun', revenue: 67000, orders: 198 },
    { month: 'Jul', revenue: 72000, orders: 215 },
    { month: 'Aug', revenue: 68000, orders: 202 },
    { month: 'Sep', revenue: 75000, orders: 225 },
    { month: 'Oct', revenue: 82000, orders: 248 },
    { month: 'Nov', revenue: 90000, orders: 278 },
    { month: 'Dec', revenue: 95000, orders: 295 },
  ],
};

const salesTrendData = [
  { day: 'Mon', sales: 24 },
  { day: 'Tue', sales: 32 },
  { day: 'Wed', sales: 28 },
  { day: 'Thu', sales: 45 },
  { day: 'Fri', sales: 38 },
  { day: 'Sat', sales: 52 },
  { day: 'Sun', sales: 41 },
];

const orderStatusData = [
  { name: 'Delivered', value: 68, color: '#10B981', status: 'delivered' },
  { name: 'Processing', value: 15, color: '#3B82F6', status: 'processing' },
  { name: 'Shipped', value: 10, color: '#F59E0B', status: 'shipped' },
  { name: 'Pending', value: 5, color: '#EF4444', status: 'pending' },
  { name: 'Cancelled', value: 2, color: '#6B7280', status: 'cancelled' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100">
        <p className="text-sm font-medium text-navy-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'revenue' ? `₹${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface RevenueChartProps {
  onFilterChange?: (filter: string) => void;
}

export function RevenueChart({ onFilterChange }: RevenueChartProps) {
  const [filter, setFilter] = useState<'7d' | '30d' | '12m'>('30d');

  const handleFilterChange = (newFilter: '7d' | '30d' | '12m') => {
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  return (
    <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-playfair font-bold text-navy-800">
            Revenue Overview
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-navy-800/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-navy-800" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '12m', label: '12 Months' },
          ].map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange(f.value as any)}
              className={filter === f.value ? 'bg-navy-800 hover:bg-navy-700' : 'border-gray-200'}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueDataMap[filter]}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B1F4D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0B1F4D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `₹${value / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0B1F4D"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                name="revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface SalesTrendChartProps {
  onChartClick?: () => void;
}

export function SalesTrendChart({ onChartClick }: SalesTrendChartProps) {
  return (
    <Card
      onClick={onChartClick}
      className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-playfair font-bold text-navy-800">
            Weekly Sales Trend
          </CardTitle>
          <div className="w-10 h-10 rounded-xl bg-pink-400/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-pink-500" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="sales"
                fill="#F7B6C6"
                radius={[8, 8, 0, 0]}
                name="sales"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Click to view Sales Reports</p>
      </CardContent>
    </Card>
  );
}

interface OrderStatusChartProps {
  onSectionClick?: (status: string) => void;
}

export function OrderStatusChart({ onSectionClick }: OrderStatusChartProps) {
  return (
    <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-playfair font-bold text-navy-800">
            Order Status
          </CardTitle>
          <div className="w-10 h-10 rounded-xl bg-navy-800/10 flex items-center justify-center">
            <PieChartIcon className="w-5 h-5 text-navy-800" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                onClick={(data) => onSectionClick?.(data.status)}
                className="cursor-pointer"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100">
                        <p className="text-sm font-medium" style={{ color: data.color }}>
                          {data.name}: {data.value}%
                        </p>
                        <p className="text-xs text-gray-400">Click to filter</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm text-gray-600">{entry.payload.name}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Click a section to filter orders</p>
      </CardContent>
    </Card>
  );
}

interface ChartsSectionProps {
  onSectionClick?: (status: string) => void;
}

export function ChartsSection({ onSectionClick }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <RevenueChart />
      </div>
      <div className="space-y-6">
        <Link href="/admin/reports?tab=sales">
          <SalesTrendChart />
        </Link>
        <OrderStatusChart onSectionClick={onSectionClick} />
      </div>
    </div>
  );
}
