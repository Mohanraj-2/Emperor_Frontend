'use client';

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
import { Eye, MoreHorizontal, Clock } from 'lucide-react';

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
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const displayOrders = orders || sampleOrders;

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
          <Button
            variant="ghost"
            className="text-navy-800 hover:bg-navy-800/10 font-medium text-sm"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
              {displayOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
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
                      >
                        <Eye className="w-4 h-4 text-navy-800" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg hover:bg-navy-800/10"
                      >
                        <MoreHorizontal className="w-4 h-4 text-navy-800" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
