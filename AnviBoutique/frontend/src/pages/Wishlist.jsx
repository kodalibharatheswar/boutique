import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Flame,
  Tag,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/wishlist', {
        withCredentials: true
      });
      setItems(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/wishlist-unauth');
      } else {
        setError("We couldn't load your wishlist right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlist/${productId}`, {
        withCredentials: true
      });
      setItems(items.filter(item => item.product.id !== productId));
      setFeedback({ type: 'success', message: 'Item removed from wishlist.' });
      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to remove item.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-serif italic text-lg">Unrolling your favorites...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* 1. HEADER & BREADCRUMBS */}
      <header className="bg-white border-b border-gray-100 py-12 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-orange-500">My Wishlist</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 italic flex items-center gap-4">
                Saved Collections <Heart className="text-red-500 fill-red-500" size={32} />
              </h1>
              <p className="text-gray-500 mt-2 text-lg">A curated list of your favorite handcrafted attire.</p>
            </div>
            <Link to="/products" className="text-sm font-bold text-orange-600 flex items-center gap-2 hover:gap-3 transition-all group">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12">
        {/* FEEDBACK BANNER */}
        {feedback.message && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-top-4 duration-300 ${
            feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold uppercase tracking-widest">{feedback.message}</p>
          </div>
        )}

        {items.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-20 text-center max-w-2xl mx-auto">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
              <Heart size={48} strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4 italic">Your wishlist is empty</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Find something you love? Add it to your wishlist to keep track of it!
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-gray-900 text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all hover:-translate-y-1"
            >
              Discover Collections
            </Link>
          </div>
        ) : (
          /* ITEM LIST */
          <div className="grid grid-cols-1 gap-6">
            {items.map((item) => {
              const p = item.product;
              const discountedPrice = p.discountPercent > 0 ? p.price * (1 - p.discountPercent / 100) : p.price;
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl transition-all duration-500 border-l-[10px] border-l-orange-500"
                >
                  {/* Image Container */}
                  <div className="relative w-40 h-52 shrink-0 rounded-[2rem] overflow-hidden bg-slate-50 border border-gray-50">
                    <img 
                      src={`/api/public/images/${p.imageUrl || 'placeholder.jpg'}`} 
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {p.discountPercent > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                        -{p.discountPercent}%
                      </div>
                    )}
                  </div>

                  {/* Details Area */}
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{p.category}</span>
                        {p.isClearance && (
                          <span className="flex items-center gap-1 text-red-600 text-[10px] font-black uppercase tracking-widest">
                            <Flame size={12} /> Clearance
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-orange-600 transition-colors italic">
                        {p.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <span className="text-3xl font-serif font-bold text-gray-900 italic">
                        ₹{discountedPrice.toFixed(2)}
                      </span>
                      {p.discountPercent > 0 && (
                        <span className="text-lg text-gray-400 line-through decoration-red-400/20 italic font-medium">
                          ₹{p.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 italic max-w-md">
                      "{p.description}"
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <Link 
                      to={`/products/${p.id}`}
                      className="w-full md:w-48 bg-gray-900 text-white py-4 rounded-2xl font-bold text-center flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                    >
                      <ShoppingBag size={18} className="text-orange-500" />
                      View Details
                    </Link>
                    <button 
                      onClick={() => handleRemove(p.id)}
                      className="w-full md:w-48 bg-white border-2 border-red-50 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={18} />
                      Remove Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;