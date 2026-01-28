
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Category } from '../types';

const Shop: React.FC = () => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const [activeCategory, setActiveCategory] = useState<string>(categoryName || 'All');
  
  useEffect(() => {
    setActiveCategory(categoryName || 'All');
  }, [categoryName]);

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const categories: string[] = ['All', 'Men', 'Women', 'Kids', 'Accessories'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Categories</h3>
            <div className="flex flex-col space-y-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left text-sm transition ${activeCategory === cat ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
                >
                  {cat}
                  {activeCategory === cat && <span className="ml-2 h-1 w-1 bg-black rounded-full inline-block"></span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded accent-black" />
                <span>$0 - $50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded accent-black" />
                <span>$50 - $150</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded accent-black" />
                <span>$150+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-serif">{activeCategory} Collection</h1>
            <p className="text-sm text-gray-400">Showing {filteredProducts.length} items</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.category}</span>
                  </div>
                  <h4 className="text-lg font-medium">{product.name}</h4>
                  <p className="text-gray-900 font-bold">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <i className="fa-solid fa-magnifying-glass text-4xl text-gray-200 mb-4"></i>
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
