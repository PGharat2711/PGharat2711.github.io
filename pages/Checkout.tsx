
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { trackPurchase, pushToDataLayer } from '../utils/gtm';

interface CheckoutProps {
  items: CartItem[];
  onClearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onClearCart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // GA4 Form Interaction Tracking (Start)
    pushToDataLayer('form_interaction', {
      form_id: 'checkout_form',
      form_field: name,
      action: 'input'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // GA4 Form Submission
    pushToDataLayer('form_submit', {
      form_id: 'checkout_form',
      success: true
    });

    // GA4 Purchase
    trackPurchase(items, total);

    onClearCart();
    alert('Order Placed Successfully! Transaction pushed to DataLayer.');
    navigate('/');
  };

  if (items.length === 0) {
    navigate('/shop');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <form onSubmit={handleSubmit} id="checkout_form" className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif mb-8">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <input 
                required
                type="text" name="firstName" placeholder="First Name" 
                onChange={handleChange}
                className="col-span-1 border-b border-gray-300 py-3 focus:border-black outline-none transition"
              />
              <input 
                required
                type="text" name="lastName" placeholder="Last Name" 
                onChange={handleChange}
                className="col-span-1 border-b border-gray-300 py-3 focus:border-black outline-none transition"
              />
              <input 
                required
                type="email" name="email" placeholder="Email Address" 
                onChange={handleChange}
                className="col-span-2 border-b border-gray-300 py-3 focus:border-black outline-none transition"
              />
              <input 
                required
                type="text" name="address" placeholder="Delivery Address" 
                onChange={handleChange}
                className="col-span-2 border-b border-gray-300 py-3 focus:border-black outline-none transition"
              />
              <input 
                required
                type="text" name="city" placeholder="City" 
                onChange={handleChange}
                className="col-span-1 border-b border-gray-300 py-3 focus:border-black outline-none transition"
              />
              <input 
                required
                type="text" name="zip" placeholder="ZIP / Postal Code" 
                onChange={handleChange}
                className="col-span-1 border-b border-gray-300 py-3 focus:border-black outline-none transition"
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-8">Payment Method</h2>
            <div className="space-y-6">
              <input 
                required
                type="text" name="cardNumber" placeholder="Card Number" 
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition"
              />
              <div className="grid grid-cols-2 gap-6">
                <input 
                  required
                  type="text" name="expiry" placeholder="MM/YY" 
                  onChange={handleChange}
                  className="col-span-1 border-b border-gray-300 py-3 focus:border-black outline-none transition"
                />
                <input 
                  required
                  type="text" name="cvv" placeholder="CVV" 
                  onChange={handleChange}
                  className="col-span-1 border-b border-gray-300 py-3 focus:border-black outline-none transition"
                />
              </div>
            </div>
          </section>

          <button type="submit" className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-gray-800 transition">
            Place Order
          </button>
        </form>

        <aside className="bg-gray-50 p-10 h-fit rounded-lg">
          <h2 className="text-xl font-serif mb-8 border-b pb-4">Your Order</h2>
          <div className="space-y-6 max-h-96 overflow-y-auto pr-4 mb-8">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex gap-4 items-center">
                  <img src={item.image} alt="" className="w-12 h-12 object-cover" />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-4 text-sm border-t pt-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between text-black font-bold text-lg pt-4 border-t">
              <span>Grand Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
