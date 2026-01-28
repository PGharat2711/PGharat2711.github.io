
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trackPurchase, pushToDataLayer } from '../utils/gtm';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem('pg_last_order');
    if (!savedOrder) {
      navigate('/');
      return;
    }
    const parsedOrder = JSON.parse(savedOrder);
    setOrder(parsedOrder);
    
    // Trigger GA4 Purchase Event
    trackPurchase(parsedOrder.items, parsedOrder.total);
    pushToDataLayer('view_order_confirmation', { order_id: parsedOrder.orderId });
    
    // Optional: Clear after tracking
    // sessionStorage.removeItem('pg_last_order');
  }, [navigate]);

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="mb-10">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
          <i className="fa-solid fa-check text-3xl"></i>
        </div>
        <h1 className="text-5xl font-serif mb-4">Thank You for Your Order</h1>
        <p className="text-gray-500 text-lg">We've received your request and are preparing it with care.</p>
        <div className="mt-8 inline-block px-6 py-2 bg-gray-50 rounded-full border border-gray-100 text-sm font-bold tracking-widest text-gray-400">
          ORDER ID: {order.orderId}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm p-8 md:p-12 shadow-sm text-left grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-[11px] uppercase font-black tracking-widest text-gray-400 mb-6 pb-2 border-b border-gray-50">Order Summary</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-4 mb-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">{item.name} <span className="text-[10px] text-gray-300 ml-1">x{item.quantity}</span></span>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-gray-50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between text-xl font-black pt-4">
              <span>Paid Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] uppercase font-black tracking-widest text-gray-400 mb-6 pb-2 border-b border-gray-50">Shipping Details</h3>
          <div className="text-sm space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-1">Recipient</p>
              <p className="font-medium text-slate-800">{order.delivery.firstName} {order.delivery.lastName}</p>
              <p className="text-gray-500">{order.delivery.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-1">Delivery Address</p>
              <p className="font-medium text-slate-800">{order.delivery.address}</p>
              <p className="text-gray-500">{order.delivery.city}, {order.delivery.zip}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-1">Estimated Delivery</p>
              <p className="font-medium text-slate-800">4-6 Business Days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-6">
        <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
          A confirmation email with tracking information has been sent to <span className="text-slate-900 font-medium">{order.delivery.email}</span>. 
          Please check your inbox (and spam folder) for further updates.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/shop" className="bg-black text-white px-12 py-5 font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition shadow-lg shadow-black/10 text-xs">
            Continue Shopping
          </Link>
          <button onClick={() => window.print()} className="border border-gray-200 px-8 py-5 font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition text-xs">
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
