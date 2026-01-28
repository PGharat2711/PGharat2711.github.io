
import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';

const Home: React.FC = () => {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] bg-gray-100 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          alt="Fashion Hero"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl text-white space-y-6">
              <span className="inline-block px-4 py-1 bg-white text-black text-xs font-bold tracking-widest uppercase">
                New Arrival 2024
              </span>
              <h2 className="text-5xl md:text-7xl font-serif font-medium leading-tight">
                Crafting Elegance <br/>For Every Moment.
              </h2>
              <p className="text-lg opacity-90 font-light max-w-md">
                Discover the latest Prateek Gharat collection where timeless design meets modern comfort.
              </p>
              <div className="pt-4">
                <Link to="/shop" className="bg-white text-black px-10 py-4 font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors inline-block">
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Editor's Choice</h3>
            <h2 className="text-4xl font-serif">Featured Arrivals</h2>
          </div>
          <Link to="/shop" className="text-black border-b border-black font-bold pb-1 group transition">
            View All Products <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group space-y-4">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                  <i className="fa-regular fa-heart text-gray-700"></i>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">{product.category}</span>
                  <div className="flex text-yellow-400 text-[10px]">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i >= Math.floor(product.rating) ? 'text-gray-200' : ''}`}></i>
                    ))}
                  </div>
                </div>
                <h4 className="text-lg font-medium group-hover:underline decoration-1 underline-offset-4">{product.name}</h4>
                <p className="text-gray-900 font-bold">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Values */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <i className="fa-solid fa-leaf text-2xl text-gray-800"></i>
            </div>
            <h4 className="text-xl font-serif">Sustainable Fabrics</h4>
            <p className="text-gray-500 text-sm leading-relaxed">We source 100% organic cotton and ethically harvested linen for all our signature pieces.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <i className="fa-solid fa-hand-holding-heart text-2xl text-gray-800"></i>
            </div>
            <h4 className="text-xl font-serif">Artisanal Craft</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Every stitch is handled by master tailors with decades of experience in high-fashion couture.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <i className="fa-solid fa-truck-fast text-2xl text-gray-800"></i>
            </div>
            <h4 className="text-xl font-serif">Global Delivery</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Fast, carbon-neutral shipping available to over 150 countries worldwide with real-time tracking.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
