import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { categoryImages, brandLogo } from '@/utils/images'
import { 
  Search, 
  Menu, 
  X, 
  User, 
  UserCircle, 
  Heart, 
  ShoppingCart, 
  ChevronDown, 
  LogOut, 
  Package, 
  MapPin, 
  Ticket, 
  Gift, 
  IdCard
} from 'lucide-react';


function CategoryCard({ category }) {
  return (
    <img src={categoryImages[category]} alt={category} />
  )
}

function Navbar() {
  return (
    <img src={brandLogo} alt="Anvi Studio" />
  )
}

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
    setIsShopOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    "Sarees", "Lehengas", "Kurtis", "Long Frocks", "Mom & Me", "Crop Top – Skirts",
    "Handlooms", "Casual Frocks", "Ready To Wear", "Dupattas", "Kids wear",
    "Dress Material", "Blouses", "Fabrics"
  ];

  const NavLink = ({ to, children, active }) => (
    <Link 
      to={to} 
      className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-orange-500 py-2 border-b-2 ${
        active ? 'text-orange-500 border-orange-500' : 'text-white border-transparent'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <div className="w-full z-[100] font-sans">
      {/* 1. STICKY OFFER BAR */}
      <div className="bg-gray-900 text-white py-2 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border-b border-white/5">
        <div className="container mx-auto px-4">
          Free Shipping on Orders Above ₹1999 — Use code <span className="text-orange-400 cursor-pointer hover:underline">FREESHIP</span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <nav className="bg-black text-white py-4 md:py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="bg-white p-1 rounded-xl group-hover:scale-105 transition-transform">
                <img src="/assets/Chaknik_Logo.png" alt="Anvi Studio" className="h-10 md:h-14 w-auto" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-serif font-bold italic leading-none">Anvi Studio</span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Heritage Boutique</span>
              </div>
            </Link>

            {/* Desktop Center: Search & Links */}
            <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative w-full max-w-xs group">
                <input 
                  type="text" 
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-10 py-2 text-xs focus:bg-white focus:text-black focus:ring-4 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-600"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors">
                  <Search size={16} />
                </button>
              </form>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
                <NavLink to="/products?sort=newest" active={location.search.includes('sort=newest')}>New Arrivals</NavLink>
                
                {/* Shop Dropdown */}
                <div className="relative group">
                  <button 
                    onClick={() => setIsShopOpen(!isShopOpen)}
                    onMouseEnter={() => setIsShopOpen(true)}
                    className={`flex items-center gap-1 text-sm font-bold uppercase tracking-widest transition-all hover:text-orange-500 py-2 border-b-2 ${
                      location.pathname.startsWith('/products') ? 'text-orange-500 border-orange-500' : 'text-white border-transparent'
                    }`}
                  >
                    Shop <ChevronDown size={14} className={`transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isShopOpen && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-3 grid grid-cols-1"
                      onMouseLeave={() => setIsShopOpen(false)}
                    >
                      {categories.map((cat) => (
                        <Link 
                          key={cat} 
                          to={`/products?category=${encodeURIComponent(cat)}`}
                          className="px-6 py-2.5 text-xs font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                      <div className="border-t border-gray-50 mt-2 pt-2">
                        <Link to="/products" className="px-6 py-2 text-xs font-black text-gray-900 uppercase tracking-widest hover:text-orange-600">All Products</Link>
                      </div>
                    </div>
                  )}
                </div>

                <NavLink to="/about" active={location.pathname === '/about'}>About</NavLink>
                <NavLink to="/contact" active={location.pathname === '/contact'}>Contact</NavLink>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-5">
              {/* Account Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-orange-400 border border-white/10">
                    {user ? <UserCircle size={20} /> : <User size={20} />}
                  </div>
                  {user && <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">{user.firstName || 'Profile'}</span>}
                </button>

                {isAccountOpen && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {!user ? (
                      <div className="p-6">
                        <h4 className="text-gray-900 font-serif font-bold text-lg mb-4">Welcome back</h4>
                        <Link to="/login" className="block w-full bg-gray-900 text-white text-center py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                          Sign In
                        </Link>
                        <p className="mt-4 text-center text-xs text-gray-400">
                          New here? <Link to="/register" className="text-orange-600 font-bold underline">Create Account</Link>
                        </p>
                      </div>
                    ) : (
                      <div className="py-4">
                        <div className="px-6 pb-4 border-b border-gray-50 mb-2">
                          <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Manage Account</p>
                          <p className="text-gray-900 font-bold">{user.email}</p>
                        </div>
                        <div className="grid grid-cols-1">
                          <Link to="/customer/profile" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium">
                            <IdCard size={18} /> My Profile
                          </Link>
                          <Link to="/customer/orders" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium">
                            <Package size={18} /> My Orders
                          </Link>
                          <Link to="/customer/addresses" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium">
                            <MapPin size={18} /> Saved Addresses
                          </Link>
                          <Link to="/customer/coupons" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium">
                            <Ticket size={18} /> My Coupons
                          </Link>
                          <Link to="/customer/gift-cards" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium">
                            <Gift size={18} /> Gift Cards
                          </Link>
                        </div>
                        <div className="px-4 mt-2">
                          <button onClick={() => {/* Logout logic */}} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors mt-2">
                            <LogOut size={18} /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link to={user ? "/wishlist" : "/login"} className="p-2 text-white hover:text-orange-500 transition-colors relative">
                <Heart size={22} />
                {/* Mock Badge */}
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </Link>

              {/* Cart Icon */}
              <Link to={user ? "/cart" : "/login"} className="p-2 text-white hover:text-orange-500 transition-colors relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-white/5 animate-in slide-in-from-top duration-300">
            <div className="p-6 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Search items..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-10 py-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
                  <Search size={20} />
                </button>
              </form>

              <div className="grid grid-cols-1 gap-4">
                <Link to="/" className="text-lg font-serif font-bold italic text-white hover:text-orange-500">Home</Link>
                <Link to="/products?sort=newest" className="text-lg font-serif font-bold italic text-white hover:text-orange-500">New Arrivals</Link>
                
                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Our Collections</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 6).map(cat => (
                      <Link key={cat} to={`/products?category=${cat}`} className="text-sm font-medium text-gray-300 py-1 hover:text-orange-400">{cat}</Link>
                    ))}
                    <Link to="/products" className="text-sm font-bold text-orange-500 py-1">View All →</Link>
                  </div>
                </div>

                <Link to="/about" className="text-lg font-serif font-bold italic text-white hover:text-orange-500">Our Story</Link>
                <Link to="/contact" className="text-lg font-serif font-bold italic text-white hover:text-orange-500">Contact Us</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;