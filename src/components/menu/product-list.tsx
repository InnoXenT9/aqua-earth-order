'use client';

import type { Product, Variant } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-provider';
import { Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductListProps {
  item: Product;
}

function QuantitySelector({ product, variant }: { product: Product, variant: Variant }) {
    const { state, dispatch } = useCart();
    const { toast } = useToast();
    const cartItem = state.items.find(item => item.id === variant.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleUpdateQuantity = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity > 0) {
            if (!cartItem) {
                 dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity: 1 } });
                 toast({
                    title: 'Added to cart!',
                    description: `1 x ${product.name} (${variant.size}) has been added.`,
                });
            } else {
                 dispatch({ type: 'UPDATE_QUANTITY', payload: { id: variant.id, quantity: newQuantity } });
            }
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: { id: variant.id } });
        }
    };
    
    if (quantity === 0) {
        return (
            <Button variant="outline" size="sm" onClick={() => handleUpdateQuantity(1)}>
                Add
            </Button>
        )
    }

    return (
        <div className="flex items-center gap-2">
             <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleUpdateQuantity(-1)}
            >
                <Minus className="h-3.5 w-3.5" />
                <span className="sr-only">Decrease quantity</span>
            </Button>
             <span className="font-bold w-5 text-center text-sm">{quantity}</span>
             <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleUpdateQuantity(1)}
            >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only">Increase quantity</span>
            </Button>
        </div>
    )
}

export function ProductList({ item }: ProductListProps) {
  return (
    <Card className="flex flex-col md:flex-row w-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="flex-grow p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground pt-1 h-10">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="space-y-3">
            {item.variants.map((variant) => (
              <div
                key={variant.id}
                className="flex justify-between items-center pb-2 border-b border-dashed last:border-none last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm">{variant.size}</p>
                  <p className="text-primary font-semibold">₹{variant.price.toFixed(2)}</p>
                </div>
                <QuantitySelector product={item} variant={variant} />
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}