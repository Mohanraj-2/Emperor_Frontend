'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
}

function KPICard({ title, value, change, isPositive, icon, onClick }: KPICardProps) {
  return (
    <Card
      onClick={onClick}
      className={`group bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </p>
            <h3 className="text-3xl font-playfair font-bold text-navy-800 mt-2">
              {value}
            </h3>
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-700 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <div className="text-pink-400">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface KPIData {
  totalRevenue: { value: string; change: string; isPositive: boolean };
  totalOrders: { value: string; change: string; isPositive: boolean };
  pendingOrders: { value: string; change: string; isPositive: boolean };
  totalCustomers: { value: string; change: string; isPositive: boolean };
  productsSold: { value: string; change: string; isPositive: boolean };
}

interface KPICardsProps {
  data?: KPIData;
  onKpiClick?: (type: string, filter?: string) => void;
}

export default function KPICards({ data, onKpiClick }: KPICardsProps) {
  const kpiData: KPIData = data || {
    totalRevenue: { value: '₹4,85,290', change: '+12.5%', isPositive: true },
    totalOrders: { value: '156', change: '+8.2%', isPositive: true },
    pendingOrders: { value: '23', change: '-5.4%', isPositive: true },
    totalCustomers: { value: '892', change: '+15.3%', isPositive: true },
    productsSold: { value: '1,247', change: '+10.8%', isPositive: true },
  };

  const cards = [
    {
      title: 'Total Revenue',
      ...kpiData.totalRevenue,
      icon: <DollarSign className="w-7 h-7" />,
      type: 'revenue',
      filter: undefined,
    },
    {
      title: 'Total Orders',
      ...kpiData.totalOrders,
      icon: <ShoppingCart className="w-7 h-7" />,
      type: 'orders',
      filter: undefined,
    },
    {
      title: 'Pending Orders',
      ...kpiData.pendingOrders,
      icon: <Clock className="w-7 h-7" />,
      type: 'orders',
      filter: 'pending',
    },
    {
      title: 'Total Customers',
      ...kpiData.totalCustomers,
      icon: <Users className="w-7 h-7" />,
      type: 'customers',
      filter: undefined,
    },
    {
      title: 'Products Sold',
      ...kpiData.productsSold,
      icon: <Package className="w-7 h-7" />,
      type: 'products',
      filter: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((card) => (
        <KPICard
          key={card.title}
          {...card}
          onClick={() => onKpiClick?.(card.type, card.filter)}
        />
      ))}
    </div>
  );
}
