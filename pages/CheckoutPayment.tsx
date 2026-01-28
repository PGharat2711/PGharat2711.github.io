
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
    
    const purchaseData = {
      items,
      total,
      delivery: deliveryInfo,
      date: new Date().toISOString(),
      orderId: `PG-${Math.floor(Math.random() * 900000 + 100000)}`
    };
    
    sessionStorage.setItem('pg_last_order', JSON.stringify(purchaseData));
    localStorage.removeItem('pg_checkout_delivery');
    onClearCart();
    
    navigate('/checkout/confirmation');
  };

  if (!deliveryInfo) return null;

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Stepper */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm ring-4 ring-green-50">
                <i className="fa-solid fa-check"></i>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-[0.15em] mt-3 text-green-600">Delivery</span>
            </div>
            <div className="w-24 h-px bg-green-500 mt-[-1.5rem]"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm ring-4 ring-slate-100">2</div>
              <span className="text-[10px] uppercase font-bold tracking-[0.15em] mt-3 text-black">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Delivery Review Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 md:p-10 border-l-4 border-l-slate-900">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Review Shipping</h3>
                  <Link to="/checkout/delivery" className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-black pb-0.5 hover:text-slate-500 hover:border-slate-500 transition">Edit</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Recipient</p>
                    <p className="font-semibold text-slate-900">{deliveryInfo.firstName} {deliveryInfo.lastName}</p>
                    <p className="text-sm text-slate-500">{deliveryInfo.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Address</p>
                    <p className="font-semibold text-slate-900">{deliveryInfo.address}</p>
                    <p className="text-sm text-slate-500">{deliveryInfo.city}, {deliveryInfo.zip}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 md:p-12">
                <h1 className="text-3xl font-serif text-slate-900 mb-10 font-semibold">Payment Details</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Cardholder Name</label>
                    <input required name="cardName" type="text" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900" placeholder="Full name as on card" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Card Number</label>
                    <div className="relative">
                      <input required name="cardNumber" type="text" placeholder="0000 0000 0000 0000" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900 font-mono tracking-widest" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <i className="fa-brands fa-cc-visa text-slate-300 text-xl"></i>
                        <i className="fa-brands fa-cc-mastercard text-slate-300 text-xl"></i>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Expiry Date</label>
                      <input required name="expiry" type="text" placeholder="MM / YY" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">CVV</label>
                      <input required name="cvv" type="text" placeholder="***" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900" />
                    </div>
                  </div>

                  <div className="pt-8">
                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-lg font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-[0.99] text-sm">
                      Complete Secure Purchase — ${total.toFixed(2)}
                    </button>
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100 flex gap-4 text-xs text-slate-500 leading-relaxed">
                      <i className="fa-solid fa-circle-info text-slate-300 mt-0.5"></i>
                      <p>Your transaction is secure and encrypted. By completing this purchase, you agree to our terms of service and refund policy.</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-slate-900 text-white rounded-xl p-8 shadow-xl shadow-slate-200 sticky top-28">
              <h2 className="text-xl font-serif mb-8 border-b border-white/10 pb-6">Payment Review</h2>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm text-white/50">
                  <span>Items Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/50">
                  <span>Shipping Fee</span>
                  <span className="text-white">$10.00</span>
                </div>
                <div className="flex justify-between font-black text-2xl pt-6 text-white border-t border-white/10 mt-4">
                  <span>Grand Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-center gap-6 opacity-30 grayscale invert brightness-0 text-3xl">
                <i className="fa-brands fa-cc-visa"></i>
                <i className="fa-brands fa-cc-mastercard"></i>
                <i className="fa-brands fa-cc-apple-pay"></i>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
