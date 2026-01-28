
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress Header */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-lg shadow-black/20">1</div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3">Delivery</span>
          </div>
          <div className="w-24 h-[2px] bg-gray-200 -mt-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-gray-100 bg-gray-50 text-gray-400 flex items-center justify-center font-bold">2</div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3 text-gray-400">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <section className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm">
            <h1 className="text-3xl font-serif mb-10">Shipping Details</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">First Name</label>
                  <input required name="firstName" type="text" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" placeholder="e.g. John" />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Last Name</label>
                  <input required name="lastName" type="text" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" placeholder="e.g. Doe" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Email Address</label>
                  <input required name="email" type="email" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Phone Number</label>
                  <input required name="phone" type="tel" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Street Address</label>
                <input required name="address" type="text" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" placeholder="House number and street name" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">City</label>
                  <input required name="city" type="text" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Zip / Postal Code</label>
                  <input required name="zip" type="text" onChange={handleChange} className="w-full border border-gray-200 px-4 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50/30" />
                </div>
              </div>

              <div className="pt-10">
                <button type="submit" className="w-full bg-black text-white py-6 font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition shadow-xl shadow-black/10 text-sm">
                  Continue to Payment
                </button>
                <div className="mt-6 flex items-center justify-center space-x-2 text-gray-400">
                  <i className="fa-solid fa-lock text-xs"></i>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Secure Encrypted Checkout</span>
                </div>
              </div>
            </form>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-gray-100 p-8 sticky top-28 bg-white shadow-sm rounded-sm">
            <h2 className="text-xl font-serif mb-8 border-b border-gray-50 pb-6">Your Order</h2>
            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-gray-50 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>{item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-8 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Items Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Fixed Shipping Rate</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between font-black text-xl pt-6 text-slate-900 border-t border-gray-100 mt-2">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutDelivery;
