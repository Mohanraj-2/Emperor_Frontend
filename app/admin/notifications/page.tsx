'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  ShoppingCart,
  AlertTriangle,
  CreditCard,
  Users,
  Check,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Filter,
  Search,
} from 'lucide-react';
import Link from 'next/link';

const sampleNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #EL-A7F9B2C1 from Rahul Sharma - ₹2,499',
    time: '2 min ago',
    date: '2024-01-15',
    isRead: false,
    link: '/admin/orders/EL-A7F9B2C1',
  },
  {
    id: '2',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #EL-B3E8D4A2 from Priya Patel - ₹1,899',
    time: '15 min ago',
    date: '2024-01-15',
    isRead: false,
    link: '/admin/orders/EL-B3E8D4A2',
  },
  {
    id: '3',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Classic Black T-Shirt (Size: M) - Only 5 left',
    time: '1 hour ago',
    date: '2024-01-15',
    isRead: false,
    link: '/admin/inventory',
  },
  {
    id: '4',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Gold Pendant - Only 2 left in stock',
    time: '2 hours ago',
    date: '2024-01-15',
    isRead: true,
    link: '/admin/inventory',
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Failed',
    message: 'Order #EL-C1F7E3B4 payment through UPI failed - Retry payment',
    time: '3 hours ago',
    date: '2024-01-15',
    isRead: true,
    link: '/admin/orders/EL-C1F7E3B4',
  },
  {
    id: '6',
    type: 'customer',
    title: 'New Customer',
    message: 'Amit Kumar registered as a new customer',
    time: '5 hours ago',
    date: '2024-01-14',
    isRead: true,
    link: '/admin/customers',
  },
  {
    id: '7',
    type: 'order',
    title: 'Order Shipped',
    message: 'Order #EL-D2G6F5C3 has been shipped to Vikram Singh',
    time: '6 hours ago',
    date: '2024-01-14',
    isRead: true,
    link: '/admin/orders/EL-D2G6F5C3',
  },
];

const notificationStyles: Record<string, { icon: React.ReactNode; iconBg: string; border: string }> = {
  order: {
    icon: <ShoppingCart className="w-5 h-5" />,
    iconBg: 'bg-blue-100 text-blue-600',
    border: 'border-l-blue-500',
  },
  stock: {
    icon: <AlertTriangle className="w-5 h-5" />,
    iconBg: 'bg-amber-100 text-amber-600',
    border: 'border-l-amber-500',
  },
  payment: {
    icon: <CreditCard className="w-5 h-5" />,
    iconBg: 'bg-red-100 text-red-600',
    border: 'border-l-red-500',
  },
  customer: {
    icon: <Users className="w-5 h-5" />,
    iconBg: 'bg-emerald-100 text-emerald-600',
    border: 'border-l-emerald-500',
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'order' | 'stock' | 'payment' | 'customer'>('all');

  const filteredNotifications = notifications.filter(n => {
    const matchesRead = filter === 'all' || (filter === 'unread' && !n.isRead);
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    return matchesRead && matchesType;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin?tab=notifications" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-navy-800">Notifications Center</h1>
              <p className="text-sm text-gray-500 font-poppins">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark All as Read
            </Button>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(notificationStyles).map(([type, style]) => {
            const count = notifications.filter(n => n.type === type).length;
            return (
              <Card
                key={type}
                className="bg-white shadow-md rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setTypeFilter(typeFilter === type ? 'all' : type as any)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.iconBg}`}>
                      {style.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-poppins capitalize">{type}</p>
                      <p className="text-2xl font-playfair font-bold text-navy-800">{count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'unread', label: 'Unread' },
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
            {typeFilter !== 'all' && (
              <Button
                variant="ghost"
                onClick={() => setTypeFilter('all')}
                className="text-pink-500"
              >
                Clear Filter
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`bg-white shadow-md rounded-2xl overflow-hidden transition-all hover:shadow-lg ${
                !notification.isRead ? 'border-l-4' : ''
              } ${notificationStyles[notification.type].border}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    notificationStyles[notification.type].iconBg
                  }`}>
                    {notificationStyles[notification.type].icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-poppins font-semibold text-navy-800">
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 w-2 h-2 inline-block rounded-full bg-pink-400" />
                          )}
                        </h3>
                        <p className="text-gray-600 font-poppins text-sm mt-1">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{notification.time}</span>
                        <Link
                          href={notification.link}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </Link>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="bg-white rounded-2xl shadow-md p-16 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-playfair text-lg font-bold text-navy-800 mb-2">No notifications</h3>
              <p className="text-gray-500 font-poppins">You&apos;re all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
