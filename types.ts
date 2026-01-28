
// TypeScript types for the Prateek Gharat e-commerce application.

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type Category = 'All' | 'Men' | 'Women' | 'Kids' | 'Accessories';
