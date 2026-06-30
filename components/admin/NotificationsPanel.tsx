'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, ShoppingCart, AlertTriangle, CreditCard } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'stock' | 'payment';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #EL-A7F9B2C1 from Rahul Sharma - ₹2,499',
    time: '2 min ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #EL-B3E8D4A2 from Priya Patel - ₹1,899',
    time: '15 min ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Classic Black T-Shirt (Size: M) - Only 5 left',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: '4',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Gold Pendant - Only 2 left in stock',
    time: '2 hours ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Failed',
    message: 'Order #EL-C1F7E3B4 payment through UPI failed',
    time: '3 hours ago',
    isRead: true,
  },
  {
    id: '6',
    type: 'payment',
    title: 'Payment Failed',
    message: 'Order #EL-D2G6F5C3 card payment declined',
    time: '5 hours ago',
    isRead: true,
  },
];

const notificationStyles = {
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
};

interface NotificationsPanelProps {
  notifications?: Notification[];
}

export default function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  const displayNotifications = notifications || sampleNotifications;
  const unreadCount = displayNotifications.filter((n) => !n.isRead).length;

  return (
    <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-playfair font-bold text-navy-800">
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-pink-400 text-navy-800 text-xs font-bold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-navy-800/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-navy-800" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 max-h-[450px] overflow-y-auto">
        <div className="space-y-4">
          {displayNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:bg-gray-50 border-l-4 ${
                notificationStyles[notification.type].border
              } ${!notification.isRead ? 'bg-gray-50/80' : 'bg-white'}`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  notificationStyles[notification.type].iconBg
                }`}
              >
                {notificationStyles[notification.type].icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      !notification.isRead ? 'text-navy-800' : 'text-gray-700'
                    }`}
                  >
                    {notification.title}
                  </h4>
                  {!notification.isRead && (
                    <span className="w-2 h-2 rounded-full bg-pink-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
