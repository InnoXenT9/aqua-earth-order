'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/cart-provider';
import { useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { CartItem } from '@/lib/types';


const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Please enter your full name.',
  }),
  deliveryAddress: z.string().min(10, {
    message: 'Please enter a complete delivery address.',
  }),
});

export function CheckoutForm() {
  const { state: cartState, totalPrice, dispatch: cartDispatch } = useCart();
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const orderConfirmedImage = PlaceHolderImages.find(img => img.id === 'order-confirmed');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || '',
      deliveryAddress: '',
    },
  });

  const generateWhatsappUrl = (orderId: string, name: string, deliveryAddress: string, items: CartItem[], total: number) => {
      const whatsappNumber = "+917821069749";
      let message = `*New Order Received!*\n\n`;
      message += `*Order ID:* ${orderId}\n`;
      message += `*Customer Name:* ${name}\n`;
      message += `*Address:* ${deliveryAddress}\n\n`;
      message += `*Order Details:*\n`;
      items.forEach(item => {
          message += `- ${item.name} (${item.size}) x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
      });
      message += `\n*Total Amount:* ₹${total.toFixed(2)}\n`;
      
      return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to place an order.' });
      return;
    }
    if (cartState.items.length === 0) {
      toast({ variant: 'destructive', title: 'Empty Cart', description: 'Your cart is empty.' });
      return;
    }

    setLoading(true);

    try {
        const orderId = `AO-${Date.now().toString().slice(-6)}`;
        const userOrdersCollection = collection(firestore, 'users', user.uid, 'orders');

        await addDoc(userOrdersCollection, {
            id: orderId,
            userId: user.uid,
            items: cartState.items,
            total: totalPrice,
            deliveryAddress: values.deliveryAddress,
            status: "new",
            createdAt: serverTimestamp(),
            idempotencyKey: uuidv4(),
        });

        cartDispatch({ type: 'CLEAR_CART' });
        
        const whatsappUrl = generateWhatsappUrl(orderId, values.name, values.deliveryAddress, cartState.items, totalPrice);

        // Redirect to WhatsApp
        window.location.href = whatsappUrl;
        
        // Show success screen after a short delay to allow whatsapp redirect to start
        setTimeout(() => setOrderPlaced(true), 1000);

    } catch (error) {
        console.error("Error placing order:", error);
        toast({ variant: 'destructive', title: 'Order Failed', description: 'Could not save your order. Please try again.' });
    } finally {
        setLoading(false);
    }
  }

  if (orderPlaced) {
    return (
      <Card className="text-center py-12">
        <CardContent className="flex flex-col items-center">
            {orderConfirmedImage && 
                <Image src={orderConfirmedImage.imageUrl} alt={orderConfirmedImage.description} width={200} height={150} data-ai-hint={orderConfirmedImage.imageHint} className="mb-6 rounded-lg"/>
            }
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-3xl font-bold">Thank you!</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Your order is being processed. You should have been redirected to WhatsApp to send the order details.
          </p>
          <div className="flex gap-4 mt-8">
            <Button onClick={() => router.push('/orders')}>
              View My Orders
            </Button>
             <Button variant="outline" onClick={() => router.push('/')}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartState.items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name} <span className="text-muted-foreground">({item.size})</span></p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x ₹{item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between items-center font-bold text-xl border-t pt-6">
          <p>Total</p>
          <p>₹{totalPrice.toFixed(2)}</p>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 123 Aqua St, Refreshment City, 12345"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading || cartState.items.length === 0}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  `Place Order & Send on WhatsApp`
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}