
import { pushToDataLayer } from './tracking.js';

// State Management
export const getCart = () => JSON.parse(localStorage.getItem('pg_cart') || '[]');
export const saveCart = (cart) => {
  localStorage.setItem('pg_cart', JSON.stringify(cart));
  updateCartBadge();
};

export const updateCartBadge = () => {
  const cart = getCart();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-count');
  badges.forEach(b => {
    b.innerText = count;
    b.classList.toggle('hidden', count === 0);
  });
};

export const getUser = () => JSON.parse(localStorage.getItem('pg_user'));

// Template Injection
export const initLayout = () => {
  const user = getUser();
  const userName = user ? user.name.split(' ')[0] : 'Account';
  
  const navHTML = `
    <nav class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <a href="index.html" class="flex-shrink-0">
            <h1 class="text-2xl font-serif tracking-tighter uppercase font-black text-gray-900">Prateek Gharat</h1>
          </a>
          <div class="hidden md:flex space-x-10 items-center">
            <a href="shop.html" class="text-gray-500 hover:text-black transition">Shop</a>
            <a href="shop.html?category=Men" class="text-gray-500 hover:text-black transition">Men</a>
            <a href="shop.html?category=Women" class="text-gray-500 hover:text-black transition">Women</a>
            <a href="shop.html?category=Kids" class="text-gray-500 hover:text-black transition">Kids</a>
          </div>
          <div class="flex items-center space-x-6">
            <a href="account.html" class="text-gray-600 hover:text-black transition flex items-center gap-2">
              <i class="fa-regular fa-user text-xl"></i>
              <span class="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">${userName}</span>
            </a>
            <a href="cart.html" class="relative text-gray-600 hover:text-black transition">
              <i class="fa-solid fa-shopping-bag text-xl"></i>
              <span class="cart-count absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center hidden">0</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `;

  const footerHTML = `
    <footer class="bg-gray-900 text-white pt-20 pb-10 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          <div class="space-y-6">
            <h2 class="text-2xl font-serif italic font-bold">Prateek Gharat</h2>
            <p class="text-gray-400 text-sm leading-relaxed">Luxury apparel for the modern connoisseur.</p>
          </div>
          <div>
            <h4 class="font-bold uppercase tracking-widest text-xs mb-6 text-white/80">Support</h4>
            <ul class="space-y-4 text-xs text-gray-400">
              <li><a href="#" class="hover:text-white transition">Shipping Policy</a></li>
              <li><a href="#" class="hover:text-white transition">Returns</a></li>
            </ul>
          </div>
        </div>
        <div class="pt-10 text-[10px] text-gray-500 uppercase tracking-widest text-center md:text-left">
          &copy; 2024 Prateek Gharat. All rights reserved.
        </div>
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);
  updateCartBadge();

  // Track Page View
  pushToDataLayer('page_view', {
    page_path: window.location.pathname,
    page_title: document.title
  });
};
