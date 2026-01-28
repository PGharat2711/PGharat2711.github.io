
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif mb-12">Shopping Bag</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <i className="fa-solid fa-bag-shopping text-6xl text-gray-200 mb-6"></i>
          <h2 className="text-2xl font-serif mb-4">Your bag is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest inline-block transition hover:bg-slate-800">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {items.map(item => (
              <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-100">
                <div className="w-32 h-40 bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-400 uppercase tracking-widest font-bold text-[10px]">{item.category}</p>
                    </div>
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-gray-50 transition"
                      >-</button>
                      <span className="px-4 text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-gray-50 transition"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-gray-50 p-8 h-fit space-y-8 sticky top-28 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-serif border-b border-gray-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Estimated Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black font-bold text-xl pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout/delivery" className="block w-full bg-black text-white py-5 text-center font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-lg shadow-black/10">
              Checkout Now
            </Link>

            <div className="pt-4 flex justify-center space-x-6 grayscale opacity-50">
              <i className="fa-brands fa-cc-visa text-3xl"></i>
              <i className="fa-brands fa-cc-mastercard text-3xl"></i>
              <i className="fa-brands fa-cc-apple-pay text-3xl"></i>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
