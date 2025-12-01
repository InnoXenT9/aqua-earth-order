import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export interface Variant {
  id: string;
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  variants: Variant[];
}

export interface MenuItem extends Product {
  // This will be deprecated in favor of Product, keeping for now.
}

export interface CartItem {
  id: string; // This will be the variant ID
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}


export type OrderStatus =
  | 'new'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  createdAt: Timestamp;
  idempotencyKey?: string;
}

export interface AppUser extends FirebaseUser {
  isAdmin?: boolean;
}