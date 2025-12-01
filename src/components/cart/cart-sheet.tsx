'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { UpdateQuantityButtons } from './update-quantity-buttons';

export function CartSheet() {
  const { state, totalItems, totalPrice } = useCart();
  const { user } = useUser();
  const emptyCartImage = PlaceHolderImages.find(img => img.id === 'empty-cart');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <Separator />
        {state.items.length > 0 ? (
          <>
            <ScrollArea className="flex-grow my-4">
              <div className="flex flex-col gap-6 pr-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-md">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.size} - ₹{item.price.toFixed(2)}
                      </p>
                      <UpdateQuantityButtons itemId={item.id} quantity={item.quantity} />
                    </div>
                    <div className="text-right">
                       <p className="font-semibold">
                         ₹{(item.price * item.quantity).toFixed(2)}
                       </p>
                     </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="mt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                {user ? (
                   <SheetClose asChild>
                    <Button asChild className="w-full" size="lg">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                   </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Button asChild className="w-full" variant="secondary">
                       <Link href="/login">Login to place order</Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            {emptyCartImage && 
              <Image
                src={emptyCartImage.imageUrl}
                alt={emptyCartImage.description}
                width={200}
                height={150}
                className="mb-4 rounded-lg"
                data-ai-hint={emptyCartImage.imageHint}
              />
            }
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground mt-2">
              Looks like you haven't added anything to your cart yet.
            </p>
            <SheetClose asChild>
              <Button className="mt-6">Start Shopping</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}