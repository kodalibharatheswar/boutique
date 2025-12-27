import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingBag, 
  MapPin, 
  UserCircle, 
  Ticket, 
  Gift, 
  Heart, 
  ChevronRight, 
  Star,
  Loader2,
  Package,
  ShoppingCart
} from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuration for quick links
  const quickLinks = [
    { label: 'My Orders', icon: ShoppingBag, path: '/customer/orders', color: 'bg-blue-50 text-blue-600' },
    { label: 'Saved Addresses', icon: MapPin, path: '/customer/addresses', color: 'bg-green-50 text-green-600' },
    { label: 'Profile Settings', icon: UserCircle, path: '/customer/profile', color: 'bg-purple-50 text-purple-600' },
    { label: 'Gift Cards', icon: Gift, path: '/customer/gift-cards', color: 'bg-pink-50 text-pink-600' },
    { label: 'Coupons', icon: Ticket, path: '/customer/coupons', color: 'bg-orange-50 text-orange-600' },
    { label: 'My Wishlist', icon: Heart, path: '/wishlist', color: 'bg-red-50 text-red-600' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch profile and initial products in parallel
        const [profileRes, productsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/customer/profile', { withCredentials: true }),
          axios.get('http://localhost:8080/api/products', { withCredentials: true })
        ]);

        setProfile(profileRes.data);
        // Take only top 4 products for the dashboard preview
        setProducts(productsRes.data.products.slice(0, 4));
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Preparing your personalized dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* WELCOME BANNER */}
      <section className="bg-gray-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <UserCircle size={200} />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-3xl bg-orange-500 flex items-center justify-center text-3xl font-serif font-bold shadow-xl shadow-orange-500/20">
              {profile?.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold italic">
                Welcome back, {profile?.firstName || 'Valued Customer'}!
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <Star size={14} className="text-orange-400 fill-current" />
                Member Since 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 -mt-10">
        {/* QUICK ACTIONS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {quickLinks.map((link, idx) => (
            <Link 
              key={idx} 
              to={link.path}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`${link.color} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                <link.icon size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* FEATURED PRODUCTS PREVIEW */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 italic">Recommended for You</h2>
              <div className="h-1 w-12 bg-orange-500 rounded-full mt-2"></div>
            </div>
            <Link to="/products" className="text-sm font-bold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
              View All Collection <ChevronRight size={16} />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100">
              <Package size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 italic">No recommendations available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-50">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    <img 
                      src={`/api/public/images/${p.imageUrl || 'placeholder.jpg'}`} 
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {p.stockQuantity === 0 && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Sold Out</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">{p.category}</p>
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-orange-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-serif font-bold text-gray-900">₹{p.price.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <button className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <Heart size={18} />
                        </button>
                        <button className="p-2 bg-gray-900 text-white hover:bg-orange-500 rounded-xl transition-colors shadow-lg shadow-gray-200">
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;