import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  RefreshCcw, 
  Share2, 
  Facebook, 
  MessageCircle, 
  Copy, 
  Ruler, 
  Info, 
  ShieldCheck, 
  Flame, 
  Tag,
  ChevronRight,
  Loader2,
  AlertCircle,
  Plus,
  Minus,
  CheckCircle2
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  useEffect(() => {
    fetchProductDetails();
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:8080/api/products/${id}`);
      setData(response.data);
    } catch (err) {
      setError("We couldn't find the product you're looking for.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (data.product.sizeOptions && !selectedSize) {
      setFeedback({ type: 'error', message: 'Please select a size first.' });
      return;
    }

    try {
      setIsAddingToCart(true);
      const params = new URLSearchParams();
      params.append('productId', id);
      params.append('quantity', quantity);
      if (selectedSize) params.append('size', selectedSize);

      await axios.post('http://localhost:8080/api/cart/add', params, { withCredentials: true });
      
      setFeedback({ type: 'success', message: 'Added to your boutique cart!' });
      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: `/products/${id}` } });
      } else {
        setFeedback({ type: 'error', message: 'Failed to add item. Please try again.' });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const params = new URLSearchParams();
      params.append('productId', id);
      await axios.post('http://localhost:8080/api/wishlist', params, { withCredentials: true });
      setFeedback({ type: 'success', message: 'Moved to your favorites!' });
      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const copyLink = () => {
    const url = window.location.href;
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setFeedback({ type: 'success', message: 'Link copied to clipboard!' });
      setTimeout(() => setFeedback({ type: null, message: '' }), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-400 font-serif italic">Preparing the details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center max-w-lg border border-gray-100">
          <AlertCircle className="mx-auto text-red-400 mb-6" size={64} />
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link to="/products" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all">
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  const p = data.product;
  const discountedPrice = p.discountPercent > 0 ? p.price * (1 - p.discountPercent / 100) : p.price;

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-orange-500">Collections</Link>
          <ChevronRight size={12} />
          <span className="text-orange-500 truncate max-w-[150px] md:max-w-none">{p.name}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-50 shadow-2xl border border-gray-100 group">
              <img 
                src={`/api/public/images/${p.imageUrl || 'placeholder.jpg'}`} 
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {p.discountPercent > 0 && (
                <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg">
                  {p.discountPercent}% Off
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: CONTENT & ACTIONS */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border border-orange-100">
                  {p.category}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {p.sku}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
                {p.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-serif font-bold text-gray-900 italic">
                  ₹{discountedPrice.toFixed(2)}
                </span>
                {p.discountPercent > 0 && (
                  <span className="text-xl text-gray-400 line-through decoration-red-400/30">
                    ₹{p.price.toFixed(2)}
                  </span>
                )}
                {p.isClearance && (
                  <span className="flex items-center gap-1 text-red-600 text-xs font-black uppercase tracking-widest animate-pulse">
                    <Flame size={14} /> Clearance Sale
                  </span>
                )}
              </div>

              <p className="text-gray-500 leading-relaxed text-lg mb-8 italic border-l-4 border-orange-500/10 pl-6">
                "{p.description}"
              </p>
            </div>

            {/* SELECTION FORMS */}
            <div className="space-y-8 mb-10">
              {/* Size Selector */}
              {p.sizeOptions && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Select Size</label>
                    <button className="text-[10px] font-bold text-orange-500 flex items-center gap-1 hover:underline">
                      <Ruler size={12} /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {p.sizeOptions.split(',').map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size.trim())}
                        className={`min-w-[50px] h-12 rounded-xl font-bold transition-all border-2 ${
                          selectedSize === size.trim() 
                          ? 'border-gray-900 bg-gray-900 text-white shadow-xl' 
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {size.trim()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and CTA */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Quantity</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100 w-fit">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white rounded-xl transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(p.stockQuantity, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white rounded-xl transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex-1 flex gap-3">
                    <button 
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || p.stockQuantity === 0}
                      className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                    >
                      {p.stockQuantity === 0 ? 'Out of Stock' : <><ShoppingBag size={20} className="text-orange-500" /> Add to Cart</>}
                    </button>
                    <button 
                      onClick={handleAddToWishlist}
                      className="w-16 h-full flex items-center justify-center border-2 border-gray-100 rounded-2xl text-gray-300 hover:text-red-500 hover:border-red-100 transition-all group"
                    >
                      <Heart size={24} className="group-active:scale-125 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Feedback Overlay */}
              {feedback.message && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl animate-in slide-in-from-top-4 duration-300 border ${
                  feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="text-xs font-bold uppercase tracking-widest">{feedback.message}</span>
                </div>
              )}
            </div>

            {/* TRUST BAR */}
            <div className="mt-auto grid grid-cols-2 gap-4 py-8 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-slate-50 p-2 rounded-xl text-slate-400"><Truck size={18}/></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-900">Delivery</p>
                  <p className="text-[10px] text-gray-400 leading-tight">4-6 Business Days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-slate-50 p-2 rounded-xl text-slate-400"><RefreshCcw size={18}/></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-900">Returns</p>
                  <p className="text-[10px] text-gray-400 leading-tight">7-Day Exchange</p>
                </div>
              </div>
              <div className="col-span-2 pt-4 flex items-center justify-between border-t border-dashed border-gray-100 mt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Share your style</span>
                <div className="flex gap-4">
                  <button onClick={copyLink} className="text-gray-400 hover:text-gray-900 transition-colors"><Copy size={16}/></button>
                  <button className="text-gray-400 hover:text-[#25D366] transition-colors"><MessageCircle size={16}/></button>
                  <button className="text-gray-400 hover:text-[#1877F2] transition-colors"><Facebook size={16}/></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TABS SECTION */}
        <section className="mt-24 border-t border-gray-100">
          <div className="flex justify-center -mt-px">
            <div className="flex gap-10">
              {[
                { id: 'desc', label: 'Details' },
                { id: 'info', label: 'Fabric & Care' },
                { id: 'reviews', label: `Reviews (${data.reviews?.length || 0})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-6 text-xs font-black uppercase tracking-[0.3em] border-t-2 transition-all ${
                    activeTab === tab.id ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-300 hover:text-gray-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-16 max-w-4xl mx-auto">
            {activeTab === 'desc' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed italic text-lg">
                  {p.description}
                </div>
                {p.productTags && (
                  <div className="pt-8 border-t border-gray-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <Tag size={12} /> Search Identifiers
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.productTags.split(',').map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="animate-in fade-in duration-500 bg-slate-50 p-10 rounded-[2.5rem] border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                      <Info size={16} className="text-orange-500" /> Maintenance Guide
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap italic">
                      {p.additionalInformation || "Handle with care. Dry clean recommended for silk and embellished handloom pieces to preserve texture and color integrity."}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-orange-500" /> Authenticity
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed italic">
                      Every piece in the {p.category} collection is verified for quality. Minor variations in weave are not defects but signatures of handloom craft.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-in fade-in duration-500 space-y-10">
                {data.reviews.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                    <Star size={48} className="mx-auto mb-4" />
                    <p className="font-serif italic text-lg text-gray-400">Be the first to share your experience with this {p.category.toLowerCase()}.</p>
                  </div>
                ) : (
                  <div className="grid gap-8">
                    {data.reviews.map(review => (
                      <div key={review.id} className="bg-slate-50/50 p-8 rounded-3xl border border-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex text-yellow-400 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                              ))}
                            </div>
                            <p className="font-bold text-gray-900">{review.user.username}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(review.reviewDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 3. RELATED PRODUCTS */}
        {data.relatedProducts?.length > 0 && (
          <section className="py-24 border-t border-gray-100">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold italic">You May Also Adore</h2>
                <p className="text-gray-400 text-sm mt-1">Curated recommendations from our {p.category} collection.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.relatedProducts.map(rp => (
                <Link key={rp.id} to={`/products/${rp.id}`} className="group space-y-4">
                  <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-50 relative border border-gray-100 shadow-sm transition-all group-hover:shadow-xl group-hover:-translate-y-2">
                    <img src={`/api/public/images/${rp.imageUrl || 'placeholder.jpg'}`} className="w-full h-full object-cover" alt="" />
                    {rp.discountPercent > 0 && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                        Sale
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{rp.name}</h4>
                    <p className="text-gray-900 font-serif italic text-lg font-bold">₹{rp.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;