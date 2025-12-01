import type { Product } from './types';

export const initialProducts: Product[] = [
  {
    id: 'coke-1',
    name: 'Coca-Cola',
    description: 'Classic and refreshing Coca-Cola.',
    category: 'Soft Drinks',
    variants: [
      { id: 'coke-200', size: '200ml', price: 20 },
      { id: 'coke-500', size: '500ml', price: 40 },
    ],
  },
  {
    id: 'pepsi-1',
    name: 'Pepsi',
    description: 'Bold and refreshing Pepsi cola.',
    category: 'Soft Drinks',
    variants: [
      { id: 'pepsi-200', size: '200ml', price: 20 },
      { id: 'pepsi-500', size: '500ml', price: 40 },
    ],
  },
  {
    id: 'jeera-soda-1',
    name: 'Jeera Soda',
    description: 'Spicy and tangy cumin-flavored soda.',
    category: 'Soft Drinks',
    variants: [
        { id: 'jeera-10', size: '250ml', price: 25 },
        { id: 'jeera-20', size: '500ml', price: 45 },
    ],
  },
  {
    id: 'red-bull-1',
    name: 'Red Bull',
    description: 'The classic energy drink that gives you wings.',
    category: 'Energy Drinks',
    variants: [
      { id: 'red-bull-250', size: '250ml', price: 120 },
    ],
  },
  {
    id: 'monster-1',
    name: 'Monster Energy',
    description: 'A popular energy drink with a strong punch.',
    category: 'Energy Drinks',
    variants: [
      { id: 'monster-500', size: '500ml', price: 190 },
    ],
  },
  {
    id: 'orange-juice-1',
    name: 'Orange Juice',
    description: 'Freshly squeezed orange juice.',
    category: 'Juices',
    variants: [
      { id: 'orange-250', size: '250ml', price: 80 },
      { id: 'orange-500', size: '500ml', price: 150 },
    ],
  },
  {
    id: 'apple-juice-1',
    name: 'Apple Juice',
    description: 'Sweet and crisp apple juice.',
    category: 'Juices',
    variants: [
      { id: 'apple-250', size: '250ml', price: 80 },
      { id: 'apple-500', size: '500ml', price: 150 },
    ],
  },
];