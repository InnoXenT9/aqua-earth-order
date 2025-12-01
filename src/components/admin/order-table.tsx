'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  collectionGroup,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Order, OrderStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpDown } from 'lucide-react';
import { updateDocumentNonBlocking } from '@/firebase';

type SortKey = 'createdAt' | 'total' | 'status';

const statusOptions: OrderStatus[] = ['new', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const statusColors: Record<OrderStatus, string> = {
  new: 'bg-blue-500',
  preparing: 'bg-yellow-500',
  out_for_delivery: 'bg-orange-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export function OrderTable() {
  const firestore = useFirestore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const ordersQuery = query(collectionGroup(firestore, 'orders'));
      const snapshot = await getDocs(ordersQuery);
      const fetchedOrders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
      setOrders(fetchedOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [firestore]);

  const handleStatusChange = (orderId: string, userId: string, newStatus: OrderStatus) => {
    const orderRef = doc(firestore, 'users', userId, 'orders', orderId);
    updateDocumentNonBlocking(orderRef, { status: newStatus });
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
        title: "Status Updated",
        description: `Order #${orderId.slice(0,7)} is now '${newStatus.replace('_', ' ')}'.`
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortKey(key);
        setSortDirection('desc');
    }
  }

  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter(order =>
        order.id.toLowerCase().includes(filter.toLowerCase()) ||
        order.userId.toLowerCase().includes(filter.toLowerCase()) ||
        order.deliveryAddress.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        let comparison = 0;
        if (aVal > bVal) comparison = 1;
        if (aVal < bVal) comparison = -1;
        return sortDirection === 'desc' ? -comparison : comparison;
      });
  }, [orders, filter, sortKey, sortDirection]);

  if (loading) {
    return (
        <div className="space-y-2">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
  }

  return (
    <div>
      <Input
        placeholder="Filter by Order ID, User ID, or Address..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                    Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('total')}>
                    Total <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">#{order.id.slice(0, 7)}</TableCell>
                <TableCell className="font-mono text-xs">{order.userId.slice(0, 7)}</TableCell>
                <TableCell>{order.createdAt.toDate().toLocaleDateString()}</TableCell>
                <TableCell>₹{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value: OrderStatus) => handleStatusChange(order.id, order.userId, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue>
                            <Badge variant="default" className={`capitalize ${statusColors[order.status]} hover:${statusColors[order.status]}`}>{order.status.replace('_', ' ')}</Badge>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{order.deliveryAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}