import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Filter, 
  ChevronRight, 
  Search, 
  Heart, 
  ShoppingCart, 
  Slant, 
  Loader2, 
  X,
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // URL-driven state
  const categoryParam = queryParams.get('category') || '';
  const keywordParam = queryParams.get('keyword') || '';

  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter/Sort state
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    status: '',
    color: ''
  });
  const [sortBy, setSortBy] = useState('latest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Constants
  const colors = ['Maroon', 'Gold', 'Emerald', 'Silk White', 'Navy', 'Mustard', 'Pink'];

  useEffect(() => {
    fetchProductsAndCategories();
  }, [categoryParam, keywordParam]);

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      // Fetch products based on category from URL
      const response = await axios.get('http://localhost:8080/api/products', {
        params: { category: categoryParam },
        withCredentials: true
      });
      
      setProducts(response.data.products);
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic for Client-side Filtering and Sorting
  const processedProducts = products
    .filter(p => {
      // 1. Keyword search (if not handled by backend)
      const matchesKeyword = keywordParam ? p.name.toLowerCase().includes(keywordParam.toLowerCase()) : true;
      // 2. Price Range
      const discountedPrice = p.discountPercent > 0 ? p.price * (1 - p.discountPercent / 100) : p.price;
      const matchesPrice = discountedPrice >= filters.minPrice && discountedPrice <= filters.maxPrice;
      // 3. Status
      let matchesStatus = true;
      if (filters.status === 'inStock') matchesStatus = p.stockQuantity > 0;
      if (filters.status === 'onSale') matchesStatus = p.discountPercent > 0;
      if (filters.status === 'clearance') matchesStatus = p.discountPercent >= 50;
      // 4. Color (assuming product has a productColor field)
      const matchesColor = filters.color ? p.productColor === filters.color : true;

      return matchesKeyword && matchesPrice && matchesStatus && matchesColor;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'oldest') return new Date(a.id) - new Date(b.id);
      return new Date(b.id) - new Date(a.id); // latest
    });

  const handleWishlist = async (productId) => {
    try {
      await axios.post('http://localhost:8080/api/wishlist', null, {
        params: { productId },
        withCredentials: true
      });
      // In a real app, you'd trigger a global notification here
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 1. HEADER SECTION */}
      <header className="bg-slate-50 border-b border-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <ChevronRight size={10} />
            <span className="text-orange-500">{categoryParam || 'All Collections'}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 italic capitalize">
                {categoryParam ? `${categoryParam}` : 'The Boutique Collection'}
              </h1>
              {keywordParam && (
                <p className="text-gray-500 mt-2 text-sm">Showing results for: <span className="font-bold text-gray-900">"{keywordParam}"</span></p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                <Filter size={16} /> Filters
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="latest">Latest Arrivals</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 2. FILTER SIDEBAR (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-10">
            {/* Category List */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center justify-between">
                Categories
                <div className="h-px w-10 bg-gray-100"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/products" 
                    className={`text-sm transition-colors ${!categoryParam ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    All Collections
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat}>
                    <Link 
                      to={`/products?category=${cat}`} 
                      className={`text-sm transition-colors ${categoryParam === cat ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center justify-between">
                Price Range
                <div className="h-px w-10 bg-gray-100"></div>
              </h3>
              <div className="space-y-4">
                <input 
                  type="range" min="0" max="100000" step="500"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between items-center text-[10px] font-black text-gray-900 uppercase">
                  <span>₹0</span>
                  <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-md">Up to ₹{filters.maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center justify-between">
                Status
                <div className="h-px w-10 bg-gray-100"></div>
              </h3>
              <div className="space-y-3">
                {[
                  { id: '', label: 'All Items' },
                  { id: 'inStock', label: 'In Stock' },
                  { id: 'onSale', label: 'On Sale' },
                  { id: 'clearance', label: 'Clearance' }
                ].map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setFilters({...filters, status: s.id})}
                    className={`w-full text-left text-sm py-1 transition-colors ${filters.status === s.id ? 'text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center justify-between">
                Curated Colors
                <div className="h-px w-10 bg-gray-100"></div>
              </h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setFilters({...filters, color: ''})}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${!filters.color ? 'border-orange-500 text-orange-500' : 'border-gray-100 text-gray-300'}`}
                >
                  ALL
                </button>
                {colors.map(color => (
                  <button 
                    key={color}
                    title={color}
                    onClick={() => setFilters({...filters, color})}
                    className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 shadow-sm ${filters.color === color ? 'border-orange-500 scale-110 ring-2 ring-orange-50' : 'border-white'}`}
                    style={{ backgroundColor: color.replace(' ', '').toLowerCase() === 'silkwhite' ? '#f8f8f8' : color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* 3. PRODUCT GRID */}
          <div className="flex-1">
            {processedProducts.length === 0 ? (
              <div className="bg-slate-50 rounded-[3rem] py-32 text-center border border-dashed border-slate-200">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Search className="text-gray-300" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-800 italic mb-2">No items found</h2>
                <p className="text-gray-400 max-w-xs mx-auto">Try adjusting your filters or browsing a different category.</p>
                <button 
                  onClick={() => setFilters({ minPrice: 0, maxPrice: 100000, status: '', color: '' })}
                  className="mt-8 text-orange-600 font-bold uppercase text-[10px] tracking-widest hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {processedProducts.map((p) => (
                  <div key={p.id} className="group cursor-pointer">
                    <Link to={`/products/${p.id}`}>
                      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-50 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-gray-100">
                        <img 
                          src={`/api/public/images/${p.imageUrl || 'placeholder.jpg'}`} 
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        
                        {/* Tags & Badges */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                          {p.discountPercent > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                              -{p.discountPercent}%
                            </span>
                          )}
                          {p.discountPercent >= 50 && (
                            <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1 shadow-lg animate-pulse">
                              <Flame size={10} /> Hot
                            </span>
                          )}
                        </div>

                        {/* Quick Action Overlay */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button 
                            onClick={(e) => { e.preventDefault(); handleWishlist(p.id); }}
                            className="bg-white p-4 rounded-2xl text-gray-400 hover:text-red-500 hover:scale-110 transition-all shadow-xl"
                          >
                            <Heart size={20} />
                          </button>
                        </div>
                      </div>
                    </Link>

                    <div className="px-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">{p.category}</p>
                          <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 italic font-serif text-lg">{p.name}</h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{(p.discountPercent > 0 ? p.price * (1 - p.discountPercent/100) : p.price).toFixed(2)}
                        </span>
                        {p.discountPercent > 0 && (
                          <span className="text-sm text-gray-400 line-through decoration-red-400/20 italic">₹{p.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE FILTER MODAL */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[1000] lg:hidden bg-white animate-in slide-in-from-bottom duration-300">
          <div className="h-full flex flex-col p-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif font-bold italic">Refine Results</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-50 rounded-full"><X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-12">
              {/* Reuse sidebar logic here or componentize it */}
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Max Price: ₹{filters.maxPrice.toLocaleString('en-IN')}</p>
                <input 
                  type="range" min="0" max="100000" step="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>

            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold mt-6 shadow-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;