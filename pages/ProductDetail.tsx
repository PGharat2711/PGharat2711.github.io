
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { trackProductView, trackAddToCart } from '../utils/gtm';

interface ProductDetailProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  useEffect(() => {
    const found = PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      trackProductView(found);
    } else {
      navigate('/shop');
    }
  }, [id, navigate]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    trackAddToCart(product, quantity);
    // Simple visual feedback
    alert(`Added ${quantity} ${product.name}(s) to cart.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 overflow-hidden cursor-pointer hover:opacity-75 transition">
                <img src={product.image} alt="thumbnail" className="w-full h-full object-cover grayscale opacity-50" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{product.category}</span>
            <h1 className="text-4xl font-serif">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-star ${i >= Math.floor(product.rating) ? 'text-gray-200' : ''}`}></i>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews} customer reviews)</span>
            </div>
          </div>

          <p className="text-3xl font-black text-gray-900">${product.price.toFixed(2)}</p>

          <p className="text-gray-600 leading-relaxed max-w-lg">
            {product.description}
          </p>

          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Select Size</h4>
              <div className="flex space-x-3">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-sm border transition ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-200 h-14">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 hover:bg-gray-50 transition h-full"
                >-</button>
                <span className="px-4 font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 hover:bg-gray-50 transition h-full"
                >+</button>
              </div>
              <button 
                onClick={handleAdd}
                className="flex-1 bg-black text-white h-14 font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg shadow-black/10"
              >
                Add to Bag
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-10">
            <div className="flex items-center space-x-3 text-sm">
              <i className="fa-solid fa-shield-halved text-gray-400"></i>
              <span>Secure checkout and payment protection</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <i className="fa-solid fa-rotate-left text-gray-400"></i>
              <span>30-day easy return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
