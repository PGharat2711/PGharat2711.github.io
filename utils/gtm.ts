
import { CartItem, Product, User } from '../types';

export const pushToDataLayer = (event: string, payload: any) => {
  const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
  dataLayer.push({
    event,
    ...payload,
  });
  console.log(`[GA4 EVENT: ${event}]`, payload);
};

export const trackProductView = (product: Product) => {
  pushToDataLayer('view_item', {
    ecommerce: {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1
      }]
    }
  });
};

export const trackAddToCart = (product: Product, quantity: number = 1) => {
  pushToDataLayer('add_to_cart', {
    ecommerce: {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity
      }]
    }
  });
};

export const trackBeginCheckout = (items: CartItem[], total: number) => {
  pushToDataLayer('begin_checkout', {
    ecommerce: {
      currency: 'USD',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }
  });
};

export const trackAddShippingInfo = (items: CartItem[], total: number) => {
  pushToDataLayer('add_shipping_info', {
    ecommerce: {
      currency: 'USD',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }
  });
};

export const trackPurchase = (items: CartItem[], total: number) => {
  pushToDataLayer('purchase', {
    ecommerce: {
      transaction_id: `T_${Date.now()}`,
      value: total,
      tax: total * 0.1,
      shipping: 10,
      currency: 'USD',
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    }
  });
};

export const trackUserLogin = (user: User) => {
  pushToDataLayer('login', {
    user_id: user.id,
    method: 'email'
  });
};
