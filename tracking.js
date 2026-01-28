
/**
 * GA4 Ecommerce Tracking Module
 * Following official schema: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm
 */

export const pushToDataLayer = (event, payload) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: event,
    ...payload,
  });
  console.log(`[GA4 EVENT: ${event}]`, payload);
};

const mapProductToGA4Item = (product, index = 0, quantity = 1) => {
  return {
    item_id: String(product.id),
    item_name: product.name,
    affiliation: "Prateek Gharat Online Store",
    index: index,
    item_brand: product.brand || "Prateek Gharat",
    item_category: product.category,
    item_category2: product.category2 || "",
    item_category3: product.category3 || "",
    item_category4: product.category4 || "",
    item_variant: product.variant || "Standard",
    google_business_vertical: product.businessVertical || "retail",
    price: parseFloat(product.price),
    quantity: parseInt(quantity)
  };
};

export const trackViewItemList = (products, listName = "Primary Collection") => {
  pushToDataLayer("view_item_list", {
    ecommerce: {
      item_list_id: listName.toLowerCase().replace(/\s+/g, "_"),
      item_list_name: listName,
      items: products.map((p, i) => mapProductToGA4Item(p, i))
    }
  });
};

export const trackSelectItem = (product, index = 0, listName = "Primary Collection") => {
  pushToDataLayer("select_item", {
    ecommerce: {
      item_list_id: listName.toLowerCase().replace(/\s+/g, "_"),
      item_list_name: listName,
      items: [mapProductToGA4Item(product, index)]
    }
  });
};

export const trackProductView = (product) => {
  pushToDataLayer("view_item", {
    ecommerce: {
      currency: "USD",
      value: product.price,
      items: [mapProductToGA4Item(product)]
    }
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  pushToDataLayer("add_to_cart", {
    ecommerce: {
      currency: "USD",
      value: product.price * quantity,
      items: [mapProductToGA4Item(product, 0, quantity)]
    }
  });
};

export const trackViewCart = (cartItems) => {
  const totalValue = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  pushToDataLayer("view_cart", {
    ecommerce: {
      currency: "USD",
      value: totalValue,
      items: cartItems.map((i, idx) => mapProductToGA4Item(i, idx, i.quantity))
    }
  });
};

export const trackBeginCheckout = (cartItems) => {
  const totalValue = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  pushToDataLayer("begin_checkout", {
    ecommerce: {
      currency: "USD",
      value: totalValue,
      items: cartItems.map((i, idx) => mapProductToGA4Item(i, idx, i.quantity))
    }
  });
};

export const trackAddShippingInfo = (cartItems, shippingTier = "Standard") => {
  const totalValue = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  pushToDataLayer("add_shipping_info", {
    ecommerce: {
      currency: "USD",
      value: totalValue,
      shipping_tier: shippingTier,
      items: cartItems.map((i, idx) => mapProductToGA4Item(i, idx, i.quantity))
    }
  });
};

export const trackAddPaymentInfo = (cartItems, paymentType = "Credit Card") => {
  const totalValue = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  pushToDataLayer("add_payment_info", {
    ecommerce: {
      currency: "USD",
      value: totalValue,
      payment_type: paymentType,
      items: cartItems.map((i, idx) => mapProductToGA4Item(i, idx, i.quantity))
    }
  });
};

export const trackPurchase = (order) => {
  pushToDataLayer("purchase", {
    ecommerce: {
      transaction_id: order.orderId,
      affiliation: "Prateek Gharat Online Store",
      value: order.total,
      tax: order.total * 0.1,
      shipping: 10,
      currency: "USD",
      items: order.items.map((i, idx) => mapProductToGA4Item(i, idx, i.quantity))
    }
  });
};

export const trackSignUp = (user, method = 'email') => {
  pushToDataLayer("sign_up", {
    user_id: user.uid,
    method: method,
    timestamp: new Date().toISOString()
  });
};

export const trackLogout = (userId) => {
  // Pass the ID of the user who is logging out
  pushToDataLayer("logout", {
    user_id: userId,
    timestamp: new Date().toISOString()
  });
};
