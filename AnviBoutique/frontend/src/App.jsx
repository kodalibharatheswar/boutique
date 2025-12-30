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

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ConfirmOtp from './pages/ConfirmOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetOtp from './pages/ResetOtp';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerProfile from './pages/customer/Profile';
import CustomerOrders from './pages/customer/Orders';
import CustomerAddresses from './pages/customer/Addresses';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

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
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* 2. AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/confirm-otp" element={<ConfirmOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-otp" element={<ResetOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* 3. COMMERCE ROUTES */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />

            {/* 4. CUSTOMER PROFILE ROUTES */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
            <Route path="/customer/orders" element={<CustomerOrders />} />
            <Route path="/customer/addresses" element={<CustomerAddresses />} />

            {/* 5. ADMIN ROUTES */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* 6. POLICY ROUTES */}
            <Route path="/policy_privacy" element={<PrivacyPolicy />} />
            <Route path="/policy_return" element={<ReturnPolicy />} />
            <Route path="/policy_shipping" element={<ShippingPolicy />} />
            <Route path="/policy_terms" element={<TermsAndConditions />} />

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

export default App;