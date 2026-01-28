
export type Category = 'Men' | 'Women' | 'Kids' | 'Accessories';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
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

// DataLayer Window extension
declare global {
  interface Window {
    dataLayer: any[];
  }
}
