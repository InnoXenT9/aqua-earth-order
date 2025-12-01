import { PrivatePage } from '@/components/auth/private-page';
import { OrderTable } from '@/components/admin/order-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <PrivatePage adminOnly>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold mb-8">Admin Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>View, filter, and manage all orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTable />
          </CardContent>
        </Card>
      </div>
    </PrivatePage>
  );
}