
export const pushToDataLayer = (event, payload) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...payload,
  });
  console.log(`[GA4 EVENT: ${event}]`, payload);
};

export const trackProductView = (product) => {
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

export const trackAddToCart = (product, quantity = 1) => {
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

export const trackPurchase = (order) => {
  pushToDataLayer('purchase', {
    ecommerce: {
      transaction_id: order.orderId,
      value: order.total,
      tax: order.total * 0.1,
      shipping: 10,
      currency: 'USD',
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    }
  });
};
