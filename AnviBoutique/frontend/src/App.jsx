import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  Heart, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  Package, 
  MapPin, 
  Truck,
  ArrowLeft,
  X,
  Star,
  Settings
} from 'lucide-react';

// --- INTEGRATED LAYOUT COMPONENTS ---

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="bg-black text-white p-4 shadow-xl sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black italic text-white">A</div>
          </div>
          <span className="text-xl font-serif font-bold italic tracking-tight">Anvi Studio</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <Link to="/products" className="hover:text-orange-500 transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-orange-500 transition-colors">Our Story</Link>
          <Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-5">
          <Link to="/wishlist" className="hover:text-orange-500"><Heart size={20} /></Link>
          <Link to="/cart" className="hover:text-orange-500 relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-[8px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </Link>
          {user ? (
            <Link to="/customer/profile" className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <User size={16} className="text-orange-500" />
              <span className="text-[10px] font-bold uppercase">{user.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg">Login</Link>
          )}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-500 py-16 px-4 font-sans border-t border-white/5">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <h3 className="text-white font-serif font-bold italic text-2xl">Anvi Studio</h3>
        <p className="text-xs leading-relaxed">Artisanal excellence, curated for the modern wardrobe. Every thread tells a story of heritage.</p>
      </div>
      <div>
        <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-6">Policies</h4>
        <ul className="space-y-3 text-[11px] font-bold uppercase tracking-wider">
          <li><Link to="/policy_privacy" className="hover:text-orange-500">Privacy Policy</Link></li>
          <li><Link to="/policy_shipping" className="hover:text-orange-500">Shipping Policy</Link></li>
          <li><Link to="/policy_return" className="hover:text-orange-500">Return Policy</Link></li>
          <li><Link to="/policy_terms" className="hover:text-orange-500">Terms of Service</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-6">Customer Care</h4>
        <ul className="space-y-3 text-[11px] font-bold uppercase tracking-wider">
          <li><Link to="/contact" className="hover:text-orange-500">Contact Us</Link></li>
          <li><Link to="/customer/orders" className="hover:text-orange-500">Track Order</Link></li>
          <li><Link to="/custom-request" className="hover:text-orange-500">Custom Design</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-6">Newsletter</h4>
        <div className="flex gap-2">
          <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs w-full focus:ring-1 focus:ring-orange-500 outline-none" />
          <button className="bg-orange-500 text-white p-2 rounded-lg"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  </footer>
);

// --- DYNAMIC PAGE COMPONENT LOADER ---
// This acts as a placeholder for components defined in other files for local dev.
const PagePlaceholder = ({ title, icon: Icon }) => (
  <div className="min-h-[600px] bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
    <div className="bg-white w-24 h-24 rounded-[2.5rem] shadow-xl flex items-center justify-center text-orange-500 mb-8 border border-gray-100 animate-in zoom-in">
      <Icon size={48} />
    </div>
    <h1 className="text-4xl font-serif font-bold text-gray-900 italic mb-4">{title}</h1>
    <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
      This page logic has been generated in your previous steps. Ensure the file exists in your local <code>/src/pages</code> directory.
    </p>
    <Link to="/" className="mt-10 text-orange-600 font-bold uppercase text-[10px] tracking-[0.2em] hover:underline flex items-center gap-2">
      <ArrowLeft size={14} /> Back to Homepage
    </Link>
  </div>
);

// --- MAIN APPLICATION COMPONENT ---

function App() {
  const [user, setUser] = useState(null); // Mock user for navigation state

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Layout Wrapper: Conditionally hides Navbar on Admin routes */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Navbar user={user} />} />
        </Routes>
        
        <main className="flex-grow">
          <Routes>
            {/* 1. PUBLIC ROUTES */}
            <Route path="/" element={<PagePlaceholder title="The Home Boutique" icon={ShieldCheck} />} />
            <Route path="/about" element={<PagePlaceholder title="Our Story" icon={InfoIcon} />} />
            <Route path="/contact" element={<PagePlaceholder title="Contact Us" icon={Mail} />} />
            <Route path="/products" element={<PagePlaceholder title="The Gallery" icon={ShoppingBag} />} />
            <Route path="/products/:id" element={<PagePlaceholder title="Product Detail" icon={Package} />} />

            {/* 2. AUTH ROUTES */}
            <Route path="/login" element={<PagePlaceholder title="Customer Login" icon={User} />} />
            <Route path="/register" element={<PagePlaceholder title="Create Account" icon={User} />} />
            <Route path="/confirm-otp" element={<PagePlaceholder title="Verify Identity" icon={ShieldCheck} />} />
            <Route path="/forgot-password" element={<PagePlaceholder title="Account Recovery" icon={ShieldCheck} />} />
            <Route path="/reset-otp" element={<PagePlaceholder title="OTP Validation" icon={ShieldCheck} />} />
            <Route path="/reset-password" element={<PagePlaceholder title="New Password" icon={ShieldCheck} />} />

            {/* 3. COMMERCE ROUTES */}
            <Route path="/cart" element={<PagePlaceholder title="Shopping Cart" icon={ShoppingBag} />} />
            <Route path="/wishlist" element={<PagePlaceholder title="My Favorites" icon={Heart} />} />
            <Route path="/checkout" element={<PagePlaceholder title="Payment Portal" icon={ShieldCheck} />} />
            <Route path="/payment/success" element={<PagePlaceholder title="Order Confirmed" icon={ShieldCheck} />} />
            <Route path="/payment/cancel" element={<PagePlaceholder title="Checkout Cancelled" icon={X} />} />

            {/* 4. CUSTOMER PROFILE ROUTES */}
            <Route path="/customer/dashboard" element={<PagePlaceholder title="Dashboard" icon={Settings} />} />
            <Route path="/customer/profile" element={<PagePlaceholder title="My Profile" icon={User} />} />
            <Route path="/customer/orders" element={<PagePlaceholder title="My Orders" icon={Package} />} />
            <Route path="/customer/addresses" element={<PagePlaceholder title="Saved Addresses" icon={MapPin} />} />

            {/* 5. ADMIN ROUTES */}
            <Route path="/admin" element={<PagePlaceholder title="Admin Studio" icon={Settings} />} />

            {/* 6. POLICY ROUTES */}
            <Route path="/policy_privacy" element={<PagePlaceholder title="Privacy Policy" icon={ShieldCheck} />} />
            <Route path="/policy_return" element={<PagePlaceholder title="Return Policy" icon={ShieldCheck} />} />
            <Route path="/policy_shipping" element={<PagePlaceholder title="Shipping Policy" icon={Truck} />} />
            <Route path="/policy_terms" element={<PagePlaceholder title="Terms of Service" icon={ShieldCheck} />} />

            {/* 404 CATCH-ALL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

// Utility icon for the placeholder (Lucide wrapper)
const InfoIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

export default App;