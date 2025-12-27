import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  Star, 
  ArrowRight,
  Loader2,
  Sparkles,
  Truck,
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';

const Home = () => {
  const [data, setData] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero Slider Data
  const slides = [
    {
      image: "/api/public/images/licensed-image1.jpg",
      title: "Handcrafted Heritage",
      subtitle: "Traditional Handloom Sarees",
      cta: "Explore Collection"
    },
    {
      image: "/api/public/images/licensed-image2.jpg",
      title: "Festive Elegance",
      subtitle: "Exquisite Designer Lehengas",
      cta: "Shop Now"
    },
    {
      image: "/api/public/images/licensed-image4.jpg",
      title: "Timeless Grace",
      subtitle: "New Arrivals in Silk",
      cta: "View All"
    }
  ];

  // Shop by Category Data
  const categoryTiles = [
    { name: "Sarees", img: "sarees.png" },
    { name: "Lehengas", img: "lehengas.png" },
    { name: "Kurtis", img: "kurthi&suits.png" },
    { name: "Long Frocks", img: "longfrock.png" },
    { name: "Mom & Me", img: "Mom-Me.png" },
    { name: "Ready To Wear", img: "readymate.png" }
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/public/init');
        setData(response.data);
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-900 overflow-x-hidden">
      
      {/* 1. STICKY OFFER BAR */}
      <div className="bg-gray-900 text-white py-2 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] sticky top-0 z-50">
        ✨ Exclusive Offer: Use code <span className="text-orange-400">FIRST10</span> for 10% off your first order! ✨
      </div>

      {/* 2. HERO SLIDER */}
      <section className="relative h-[60vh] md:h-[85vh] bg-gray-100 overflow-hidden">
        {slides.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center px-4">
              <div className="max-w-3xl text-white">
                <p className="text-orange-400 uppercase tracking-[0.3em] font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  New Collection 2025
                </p>
                <h1 className="text-4xl md:text-7xl font-serif font-bold italic mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-2xl font-light mb-8 opacity-90">{slide.subtitle}</p>
                <Link to="/products" className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Navigation */}
        <button 
          onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-orange-500 w-8' : 'bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* 3. TRUST BANNER */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, label: "Free Shipping", sub: "On orders above ₹2000" },
            { icon: RefreshCcw, label: "Easy Returns", sub: "7-day return policy" },
            { icon: ShieldCheck, label: "100% Authentic", sub: "Handpicked collections" },
            { icon: Sparkles, label: "Gift Wrapping", sub: "Available on request" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><item.icon size={24} /></div>
              <h4 className="font-bold text-sm uppercase tracking-wider">{item.label}</h4>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold italic mb-2">Shop by Category</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoryTiles.map((cat, i) => (
              <Link 
                key={i} 
                to={`/products?category=${cat.name}`}
                className="group flex flex-col items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-white"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-orange-50 border-2 border-transparent group-hover:border-orange-500 transition-all">
                  <img src={`/api/public/images/shopcategory/${cat.img}`} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-600 group-hover:text-orange-600">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold italic">New Arrivals</h2>
              <p className="text-gray-400 text-sm mt-1">Freshly curated handcrafted pieces just for you.</p>
            </div>
            <Link to="/products" className="text-sm font-bold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.products.slice(0, 4).map((p) => (
              <div key={p.id} className="group relative">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm">
                  <img 
                    src={`/api/public/images/${p.imageUrl || 'placeholder.jpg'}`} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-600 shadow-sm">New</div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="bg-white p-3 rounded-2xl shadow-lg text-gray-400 hover:text-red-500"><Heart size={18} /></button>
                    <button className="bg-white p-3 rounded-2xl shadow-lg text-gray-400 hover:text-orange-500"><ShoppingBag size={18} /></button>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{p.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-lg font-serif font-bold">₹{p.price.toFixed(2)}</span>
                    {p.discountPercent > 0 && <span className="text-xs text-gray-400 line-through opacity-50">₹{(p.price * 1.2).toFixed(0)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS / BANNER */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/10 skew-x-12"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-white">
            <h2 className="text-4xl md:text-6xl font-serif font-bold italic mb-6">Unveiling the <br /> <span className="text-orange-500 underline decoration-white/20">Handloom Collection</span></h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed italic">
              "Every thread tells a story of tradition, patience, and artisan excellence. Experience the luxury of pure handloom silks."
            </p>
            <div className="flex gap-4">
              <Link to="/products?category=Handlooms" className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all">Explore Pure Silks</Link>
              <Link to="/about" className="px-10 py-4 text-white border border-white/20 rounded-full font-bold hover:bg-white hover:text-black transition-all">Our Story</Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg aspect-square bg-gray-800 rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
            <img src="/api/public/images/licensed-image3.png" alt="Featured" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 7. FLOATING WHATSAPP */}
      <a 
        href="https://wa.me/919490334557" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us!
        </span>
      </a>

    </div>
  );
};

export default Home;