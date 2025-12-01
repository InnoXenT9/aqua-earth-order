'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Order, OrderStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from '../ui/separator';

const statusColors: Record<OrderStatus, string> = {
  new: 'bg-blue-500',
  preparing: 'bg-yellow-500',
  out_for_delivery: 'bg-orange-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};


export function OrderList() {
  const { user } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'orders'),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  if (isLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-xl font-medium">No orders found.</p>
          <p className="text-muted-foreground mt-2">You haven't placed any orders yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
        {orders.map((order) => (
          <AccordionItem value={order.id} key={order.id} className="border-b-0">
            <Card className="overflow-hidden">
                <AccordionTrigger className="p-6 text-left hover:no-underline">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        <div>
                            <p className="text-sm text-muted-foreground">Order ID</p>
                            <p className="font-mono text-sm font-semibold truncate">#{order.id.slice(0, 7)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-semibold">{order.createdAt.toDate().toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                             <Badge variant="default" className={`capitalize ${statusColors[order.status]} text-white`}>
                                {order.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>
                </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Separator className="mb-4"/>
                <p className="font-semibold mb-2">Order Details:</p>
                <div className="space-y-2">
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <p>{item.name} ({item.size}) <span className="text-muted-foreground">x {item.quantity}</span></p>
                            <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <Separator className="my-4"/>
                <p className="font-semibold mb-2">Delivery Address:</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
    </Accordion>
  );
}