
import { pushToDataLayer, trackLogout } from './tracking.js';

// Re-export for convenience in other pages
export { pushToDataLayer };

/**
 * Generates a consistent 9-digit numeric ID based on an input string (like email).
 * This ensures the same user always gets the same ID upon login.
 */
export const generate9DigitId = (input) => {
    let hash = 0;
    const str = String(input).toLowerCase().trim();
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    // Ensure result is a positive 9-digit number (100,000,000 to 999,999,999)
    return (Math.abs(hash) % 900000000) + 100000000;
};

// State Management
export const getCart = () => {
    const saved = localStorage.getItem('pg_cart');
    return saved ? JSON.parse(saved) : [];
};

export const saveCart = (cart) => {
    localStorage.setItem('pg_cart', JSON.stringify(cart));
    updateCartBadge();
};

export const updateCartBadge = () => {
    const cart = getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        badge.innerText = count.toString();
        if (count > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
};

export const getUser = () => {
    const saved = localStorage.getItem('pg_user');
    return saved ? JSON.parse(saved) : null;
};

export const logoutUser = () => {
    const user = getUser();
    if (user) {
        // Track the logout event with the current user ID
        trackLogout(user.uid);
    }
    
    // Clear user from storage
    localStorage.removeItem('pg_user');
    
    // Immediately set user_id to null in dataLayer for subsequent hits
    pushToDataLayer('set_user_properties', {
        user_id: null
    });
    
    window.location.href = 'index.html';
};

// Global Layout Injection
export const initLayout = () => {
    const user = getUser();
    const userName = (user && user.name) ? user.name.split(' ')[0] : 'Account';
    
    const navHTML = `
        <nav class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <a href="index.html" class="flex-shrink-0">
                        <h1 class="text-2xl font-serif tracking-tighter uppercase font-black text-gray-900">Prateek Gharat</h1>
                    </a>
                    <div class="hidden md:flex space-x-10 items-center">
                        <a href="shop.html" class="text-gray-500 hover:text-black font-medium transition">Shop</a>
                        <a href="shop.html?category=Men" class="text-gray-500 hover:text-black font-medium transition">Men</a>
                        <a href="shop.html?category=Women" class="text-gray-500 hover:text-black font-medium transition">Women</a>
                        <a href="shop.html?category=Kids" class="text-gray-500 hover:text-black font-medium transition">Kids</a>
                    </div>
                    <div class="flex items-center space-x-6">
                        <a href="account.html" class="text-gray-600 hover:text-black transition flex items-center gap-2">
                            <i class="fa-regular fa-user text-xl"></i>
                            <span class="text-[10px] font-black uppercase tracking-widest hidden lg:inline">${userName}</span>
                        </a>
                        <a href="cart.html" class="relative text-gray-600 hover:text-black transition">
                            <i class="fa-solid fa-shopping-bag text-xl"></i>
                            <span class="cart-count absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center hidden">0</span>
                        </a>
                        ${user ? `<button onclick="window.logoutUser()" class="text-gray-400 hover:text-red-600 transition text-[10px] font-black uppercase tracking-widest hidden lg:inline">Logout</button>` : ''}
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
                        <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Redefining the standard of sustainable luxury since 2024. Handcrafted pieces for the modern lifestyle.
                        </p>
                    </div>
                    <div>
                        <h4 class="font-bold uppercase tracking-widest text-[10px] mb-6 text-white/80">Customer Care</h4>
                        <ul class="space-y-4 text-xs text-gray-400">
                            <li><a href="#" class="hover:text-white transition">Shipping & Delivery</a></li>
                            <li><a href="#" class="hover:text-white transition">Returns & Exchanges</a></li>
                            <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div class="pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                    <p>&copy; 2024 Prateek Gharat. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;

    if (!document.querySelector('nav')) {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
    if (!document.querySelector('footer')) {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
    
    // Attach logout helper to window
    window.logoutUser = logoutUser;

    updateCartBadge();

    // Include user_id in the page_view. Pass null if the user is not logged in.
    pushToDataLayer('page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
        user_id: user ? user.uid : null
    });
};
