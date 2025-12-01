'use client';

import { useCart } from '@/context/cart-provider';
import type { Product, Variant } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
  variant: Variant;
  quantity?: number;
  onDone?: () => void;
  children?: React.ReactNode;
}

export function AddToCartButton({ product, variant, quantity = 1, onDone, children }: AddToCartButtonProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    toast({
      title: 'Added to cart!',
      description: `${quantity} x ${product.name} (${variant.size}) has been added to your cart.`,
    });
    if (onDone) {
      onDone();
    }
  };

  if (children) {
     return <div onClick={handleAddToCart}>{children}</div>
  }

  return (
    <Button onClick={handleAddToCart} className="w-full">
        <>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </>
    </Button>
  );
}