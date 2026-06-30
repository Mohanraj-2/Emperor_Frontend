'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  PlusCircle,
  ClipboardList,
  Users,
  FileBarChart,
  ArrowRight,
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  iconBg: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'Add Product',
    description: 'Create new product listing',
    icon: <PlusCircle className="w-6 h-6" />,
    href: '/admin/products/new',
    gradient: 'from-navy-800 to-navy-700',
    iconBg: 'bg-pink-400',
  },
  {
    title: 'Manage Orders',
    description: 'View and update orders',
    icon: <ClipboardList className="w-6 h-6" />,
    href: '/admin/orders',
    gradient: 'from-blue-600 to-blue-700',
    iconBg: 'bg-blue-400',
  },
  {
    title: 'Manage Customers',
    description: 'View customer profiles',
    icon: <Users className="w-6 h-6" />,
    href: '/admin/customers',
    gradient: 'from-emerald-600 to-emerald-700',
    iconBg: 'bg-emerald-400',
  },
  {
    title: 'Generate Reports',
    description: 'Sales and analytics reports',
    icon: <FileBarChart className="w-6 h-6" />,
    href: '/admin/reports',
    gradient: 'from-purple-600 to-purple-700',
    iconBg: 'bg-purple-400',
  },
];

interface QuickActionCardProps {
  action: QuickAction;
}

function QuickActionCard({ action }: QuickActionCardProps) {
  return (
    <Link href={action.href} className="block group">
      <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
        <CardContent className="p-0">
          <div className={`h-2 bg-gradient-to-r ${action.gradient}`} />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-xl ${action.iconBg} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-navy-800">{action.icon}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-navy-800 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-navy-800 mt-4 group-hover:text-pink-500 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{action.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickActions.map((action) => (
        <QuickActionCard key={action.title} action={action} />
      ))}
    </div>
  );
}
