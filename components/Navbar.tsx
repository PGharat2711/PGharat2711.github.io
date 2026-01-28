
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartItem, User } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartItems, user, onLogout }) => {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-black font-bold border-b-2 border-black' : 'text-gray-500 hover:text-black transition';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-serif tracking-tighter uppercase font-black text-gray-900">
              Prateek Gharat
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-10 items-center">
            <Link to="/shop" className={isActive('/shop')}>Shop</Link>
            <Link to="/category/Men" className={isActive('/category/Men')}>Men</Link>
            <Link to="/category/Women" className={isActive('/category/Women')}>Women</Link>
            <Link to="/category/Kids" className={isActive('/category/Kids')}>Kids</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            <Link to="/account" className="text-gray-600 hover:text-black transition">
              <i className="fa-regular fa-user text-xl"></i>
              {user && <span className="ml-2 text-xs font-medium uppercase hidden lg:inline">{user.name.split(' ')[0]}</span>}
            </Link>
            <Link to="/cart" className="relative group text-gray-600 hover:text-black transition">
              <i className="fa-solid fa-shopping-bag text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user && (
              <button 
                onClick={onLogout}
                className="text-gray-400 hover:text-red-600 text-sm font-medium transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
