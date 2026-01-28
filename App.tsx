
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CheckoutDelivery from './pages/CheckoutDelivery';
import CheckoutPayment from './pages/CheckoutPayment';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import { CartItem, Product, User } from './types';
import { pushToDataLayer } from './utils/gtm';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    pushToDataLayer('page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title
    });
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pg_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pg_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('pg_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pg_user', JSON.stringify(user));
  }, [user]);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    pushToDataLayer('logout', {});
  };

  const handleClearCart = () => setCart([]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-black selection:text-white">
        <Navbar cartItems={cart} user={user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:categoryName" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
            <Route path="/cart" element={<Cart items={cart} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveFromCart} />} />
            <Route path="/checkout/delivery" element={<CheckoutDelivery items={cart} />} />
            <Route path="/checkout/payment" element={<CheckoutPayment items={cart} onClearCart={handleClearCart} />} />
            <Route path="/checkout/confirmation" element={<OrderConfirmation />} />
            <Route path="/account" element={<Account user={user} onLogin={handleLogin} />} />
          </Routes>
        </main>

        <footer className="bg-gray-900 text-white pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
              <div className="space-y-6">
                <h2 className="text-2xl font-serif italic font-bold">Prateek Gharat</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Redefining luxury fashion through minimalist aesthetics and sustainable craftsmanship since 2024.
                </p>
                <div className="flex space-x-6 text-xl">
                  <a href="#" className="hover:text-gray-400 transition"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#" className="hover:text-gray-400 transition"><i className="fa-brands fa-pinterest"></i></a>
                  <a href="#" className="hover:text-gray-400 transition"><i className="fa-brands fa-twitter"></i></a>
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">Collections</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li><Link to="/category/Men" className="hover:text-white transition">Men's Apparel</Link></li>
                  <li><Link to="/category/Women" className="hover:text-white transition">Women's Gowns</Link></li>
                  <li><Link to="/category/Kids" className="hover:text-white transition">Kids Wear</Link></li>
                  <li><Link to="/category/Accessories" className="hover:text-white transition">Accessories</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">Support</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Returns & Exchanges</a></li>
                  <li><a href="#" className="hover:text-white transition">Store Locator</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/80">Newsletter</h4>
                <p className="text-sm text-gray-400 mb-6">Join for exclusive early access and style tips.</p>
                <form 
                  className="flex"
                  onSubmit={(e) => {
                    e.preventDefault();
                    pushToDataLayer('newsletter_signup', { location: 'footer' });
                    alert('Thanks for subscribing!');
                  }}
                >
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="bg-transparent border-b border-white/30 py-2 flex-grow outline-none focus:border-white transition text-sm"
                  />
                  <button type="submit" className="border-b border-white/30 px-2 py-2 hover:text-gray-400">
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </form>
              </div>
            </div>
            
            <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
              <p>&copy; 2024 Prateek Gharat. All rights reserved.</p>
              <div className="flex space-x-10 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                <a href="#" className="hover:text-white transition">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
