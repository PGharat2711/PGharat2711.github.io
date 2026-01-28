
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartItem } from '../types';
import { trackBeginCheckout, trackAddShippingInfo, pushToDataLayer } from '../utils/gtm';

interface CheckoutDeliveryProps {
  items: CartItem[];
}

const CheckoutDelivery: React.FC<CheckoutDeliveryProps> = ({ items }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + 10;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    trackBeginCheckout(items, total);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    pushToDataLayer('form_interaction', { form_id: 'delivery_form', field: name });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pg_checkout_delivery', JSON.stringify(formData));
    trackAddShippingInfo(items, total);
    navigate('/checkout/payment');
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Stepper */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm ring-4 ring-slate-100">1</div>
              <span className="text-[10px] uppercase font-bold tracking-[0.15em] mt-3 text-black">Delivery</span>
            </div>
            <div className="w-24 h-px bg-slate-200 mt-[-1.5rem]"></div>
            <div className="flex flex-col items-center opacity-40">
              <div className="w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-500 flex items-center justify-center font-bold text-sm">2</div>
              <span className="text-[10px] uppercase font-bold tracking-[0.15em] mt-3">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-10 md:px-12">
                <h1 className="text-3xl font-serif text-slate-900 mb-8 font-semibold">Delivery Information</h1>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Contact Section */}
                  <div className="space-y-6">
                    <h2 className="text-xs uppercase font-black tracking-widest text-slate-400 flex items-center gap-3">
                      <span>01. Contact Details</span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
                        <input required name="firstName" type="text" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900 placeholder:text-slate-300" placeholder="e.g. John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
                        <input required name="lastName" type="text" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900 placeholder:text-slate-300" placeholder="e.g. Doe" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                        <input required name="email" type="email" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900 placeholder:text-slate-300" placeholder="john.doe@example.com" />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Section */}
                  <div className="space-y-6">
                    <h2 className="text-xs uppercase font-black tracking-widest text-slate-400 flex items-center gap-3">
                      <span>02. Shipping Address</span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </h2>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Street Address</label>
                        <input required name="address" type="text" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900 placeholder:text-slate-300" placeholder="123 Luxury Ave, Suite 4B" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 ml-1">City</label>
                          <input required name="city" type="text" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900 placeholder:text-slate-300" placeholder="City" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 ml-1">Zip Code</label>
                          <input required name="zip" type="text" onChange={handleChange} className="w-full border border-slate-200 bg-white px-4 py-3.5 focus:border-black focus:ring-1 focus:ring-black outline-none transition rounded-lg text-slate-900 placeholder:text-slate-300" placeholder="000000" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-lg font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-[0.99] text-sm">
                      Proceed to Payment
                    </button>
                    <div className="mt-6 flex items-center justify-center gap-3 text-slate-400 text-xs font-medium">
                      <i className="fa-solid fa-lock text-[10px]"></i>
                      <span className="uppercase tracking-widest">Secure Bank-Level Encryption</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-xl p-8 shadow-xl shadow-slate-200">
              <h2 className="text-xl font-serif mb-6 flex items-center justify-between">
                <span>Summary</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded font-sans uppercase tracking-widest font-bold">{items.length} Items</span>
              </h2>
              <div className="space-y-4 mb-8 max-h-72 overflow-y-auto pr-2 custom-scrollbar border-b border-white/10 pb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-white/80">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-white/50">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/50">
                  <span>Shipping</span>
                  <span className="text-white">$10.00</span>
                </div>
                <div className="flex justify-between font-black text-2xl pt-6 text-white border-t border-white/10 mt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDelivery;
