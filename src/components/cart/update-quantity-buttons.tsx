'use client';

import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface UpdateQuantityButtonsProps {
  itemId: string;
  quantity: number;
}

export function UpdateQuantityButtons({ itemId, quantity }: UpdateQuantityButtonsProps) {
  const { dispatch } = useCart();

  const handleUpdateQuantity = (newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
  };
  
  const handleRemoveItem = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleUpdateQuantity(quantity - 1)}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <span className="font-bold w-4 text-center">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleUpdateQuantity(quantity + 1)}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={handleRemoveItem}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove item</span>
      </Button>
    </div>
  );
}