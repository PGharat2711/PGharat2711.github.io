
import React, { useState } from 'react';
import { User } from '../types';
import { trackUserLogin } from '../utils/gtm';

interface AccountProps {
  user: User | null;
  onLogin: (user: User) => void;
}

const Account: React.FC<AccountProps> = ({ user, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: `USR_${Math.floor(Math.random() * 99999)}`,
      name: email.split('@')[0],
      email: email
    };
    onLogin(mockUser);
    trackUserLogin(mockUser);
  };

  if (user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <i className="fa-regular fa-user text-4xl text-gray-400"></i>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic">Welcome back, {user.name}</h1>
          <p className="text-gray-500">Member since 2024 • Verified Customer</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-10">
          <div className="p-6 border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
            <h4 className="font-bold mb-2">My Orders</h4>
            <p className="text-sm text-gray-500">View and track your previous purchases.</p>
          </div>
          <div className="p-6 border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
            <h4 className="font-bold mb-2">Wishlist</h4>
            <p className="text-sm text-gray-500">Saved items you're keeping an eye on.</p>
          </div>
          <div className="p-6 border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
            <h4 className="font-bold mb-2">Settings</h4>
            <p className="text-sm text-gray-500">Update your profile and shipping info.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif">Sign In</h1>
        <p className="text-gray-500">Access your orders and preferences</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-8">
        <div className="space-y-4">
          <input 
            required
            type="email" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition"
          />
          <input 
            required
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition"
          />
        </div>

        <button type="submit" className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-gray-800 transition">
          Login to Account
        </button>

        <div className="text-center">
          <a href="#" className="text-xs text-gray-400 uppercase tracking-widest font-bold hover:text-black transition">Forgot Password?</a>
        </div>
      </form>

      <div className="text-center pt-10 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-6">New to Prateek Gharat?</p>
        <button className="w-full border border-black py-4 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Account;
