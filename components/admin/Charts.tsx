'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 120 },
  { month: 'Feb', revenue: 52000, orders: 145 },
  { month: 'Mar', revenue: 48000, orders: 132 },
  { month: 'Apr', revenue: 61000, orders: 178 },
  { month: 'May', revenue: 55000, orders: 156 },
  { month: 'Jun', revenue: 67000, orders: 198 },
  { month: 'Jul', revenue: 72000, orders: 215 },
];

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
  { name: 'Delivered', value: 68, color: '#10B981' },
  { name: 'Processing', value: 15, color: '#3B82F6' },
  { name: 'Shipped', value: 10, color: '#F59E0B' },
  { name: 'Pending', value: 5, color: '#EF4444' },
  { name: 'Cancelled', value: 2, color: '#6B7280' },
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

export function RevenueChart() {
  return (
    <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-playfair font-bold text-navy-800">
            Revenue Overview
          </CardTitle>
          <div className="w-10 h-10 rounded-xl bg-navy-800/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-navy-800" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
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

export function SalesTrendChart() {
  return (
    <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
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
        <div className="h-[300px] w-full">
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
      </CardContent>
    </Card>
  );
}

export function OrderStatusChart() {
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
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
      </CardContent>
    </Card>
  );
}

export function ChartsSection({ onSectionClick }: { onSectionClick?: (status: string) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <RevenueChart />
      </div>
      <div className="space-y-6">
        <SalesTrendChart />
        <div onClick={onSectionClick ? () => onSectionClick('delivered') : undefined} className={onSectionClick ? 'cursor-pointer' : ''}>
          <OrderStatusChart />
        </div>
      </div>
    </div>
  );
}
