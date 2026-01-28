
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartItem } from '../types';
import { trackPurchase, pushToDataLayer } from '../utils/gtm';

interface CheckoutPaymentProps {
  items: CartItem[];
  onClearCart: () => void;
}

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({ items, onClearCart }) => {
  const navigate = useNavigate();
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + 10;

  useEffect(() => {
    const saved = localStorage.getItem('pg_checkout_delivery');
    if (!saved || items.length === 0) {
      navigate('/checkout/delivery');
    } else {
      setDeliveryInfo(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Finalize Purchase Meta Data
    const purchaseData = {
      items,
      total,
      delivery: deliveryInfo,
      date: new Date().toISOString(),
      orderId: `PG-${Math.floor(Math.random() * 900000 + 100000)}`
    };
    
    sessionStorage.setItem('pg_last_order', JSON.stringify(purchaseData));
    
    // We trigger purchase tracking on the confirmation page
    localStorage.removeItem('pg_checkout_delivery');
    onClearCart();
    
    navigate('/checkout/confirmation');
  };

  if (!deliveryInfo) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress Header */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              <i className="fa-solid fa-check"></i>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3 text-green-600">Delivery</span>
          </div>
          <div className="w-24 h-[2px] bg-green-500 -mt-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-lg shadow-black/20">2</div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          {/* Review Delivery Summary Card */}
          <section className="bg-gray-50 border border-gray-100 p-8 rounded-sm">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h3 className="font-bold uppercase tracking-[0.1em] text-[11px] text-gray-500">Shipping Summary</h3>
              <Link to="/checkout/delivery" className="text-xs underline font-bold hover:text-gray-600 transition">Change</Link>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Customer</p>
                <p className="font-medium">{deliveryInfo.firstName} {deliveryInfo.lastName}</p>
                <p className="text-gray-500">{deliveryInfo.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Shipping To</p>
                <p className="font-medium">{deliveryInfo.address}</p>
                <p className="text-gray-500">{deliveryInfo.city}, {deliveryInfo.zip}</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm">
            <h1 className="text-3xl font-serif mb-10">Payment Details</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Name on Card</label>
                <input required name="cardName" type="text" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30 font-medium" placeholder="Full name as printed" />
              </div>
              <div>
                <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Card Number</label>
                <input required name="cardNumber" type="text" placeholder="0000 0000 0000 0000" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30 font-mono tracking-widest" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Expiry Date</label>
                  <input required name="expiry" type="text" placeholder="MM / YY" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">CVV</label>
                  <input required name="cvv" type="text" placeholder="123" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" />
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full bg-black text-white py-6 font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition shadow-xl shadow-black/10 text-sm">
                  Finalize Purchase — ${total.toFixed(2)}
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className="lg:col-span-5">
           <div className="border border-gray-100 p-8 sticky top-28 bg-white shadow-sm rounded-sm">
            <h2 className="text-xl font-serif mb-8 border-b border-gray-50 pb-6">Payment Review</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping Fee</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between font-black text-2xl pt-6 text-slate-900 border-t border-gray-100 mt-2">
                <span>Grand Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="p-4 bg-yellow-50/50 border border-yellow-100/50 flex gap-4 text-xs text-yellow-800 rounded-sm">
              <i className="fa-solid fa-circle-info mt-0.5"></i>
              <p>Your card will be charged immediately. You can cancel or modify your order within 2 hours of purchase.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPayment;
