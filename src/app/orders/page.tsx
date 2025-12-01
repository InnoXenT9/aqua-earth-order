import { OrderList } from '@/components/orders/order-list';
import { PrivatePage } from '@/components/auth/private-page';

export default function OrdersPage() {
  return (
    <PrivatePage>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold mb-8">My Orders</h1>
        <OrderList />
      </div>
    </PrivatePage>
  );
}