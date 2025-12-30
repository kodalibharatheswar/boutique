import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryImages, brandLogo } from '@/utils/images'
import axios from 'axios';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Facebook, 
  Instagram, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  MessageCircle
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

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Connects to the NewsletterRestController endpoint
      const response = await axios.post('http://localhost:8080/api/public/newsletter/subscribe', { email });
      setStatus({ type: 'success', message: response.data.message });
      setEmail('');
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || "Subscription failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#111] text-white pt-16 pb-8 font-sans mt-auto" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRAND & NEWSLETTER */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="bg-white p-1 rounded-lg">
                <img src="/assets/Chaknik_Logo.png" alt="Anvi Studio" className="h-10 w-auto" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight italic">Anvi Studio</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Handpicked ethnic wear and traditional handlooms curated for the modern woman who values her roots.
            </p>
            
            <div className="pt-4">
              <h6 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-4">Join our circle</h6>
              <form onSubmit={handleSubscribe} className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-600"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white px-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
              {status.message && (
                <div className={`mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {status.type === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {status.message}
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="space-y-6">
            <h6 className="text-xs font-black uppercase tracking-[0.2em] text-white">Collections</h6>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/products?category=Sarees" className="hover:text-orange-500 transition-colors">Traditional Sarees</Link></li>
              <li><Link to="/products?category=Lehengas" className="hover:text-orange-500 transition-colors">Designer Lehengas</Link></li>
              <li><Link to="/products?category=Kurtis" className="hover:text-orange-500 transition-colors">Elegant Kurtis</Link></li>
              <li><Link to="/custom-request" className="hover:text-orange-500 transition-colors">Custom Outfits</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: INFORMATION */}
          <div className="space-y-6">
            <h6 className="text-xs font-black uppercase tracking-[0.2em] text-white">Company</h6>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Anvi Studio</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/policy_privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policy_shipping" className="hover:text-orange-500 transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT & SOCIAL */}
          <div className="space-y-6">
            <h6 className="text-xs font-black uppercase tracking-[0.2em] text-white">Get In Touch</h6>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Vijayawada, Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <a href="mailto:avnistudio@gmail.com" className="hover:text-white transition-colors">avnistudio@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-orange-500 shrink-0" />
                <span>+91 94903 34557</span>
              </li>
            </ul>
            
            <div className="pt-4 flex gap-4">
              <a href="https://www.facebook.com/bharatheswar.kodali/" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-xl hover:bg-orange-500 hover:scale-110 transition-all">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/avnistudio" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-xl hover:bg-orange-500 hover:scale-110 transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/919490334557" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-xl hover:bg-green-500 hover:scale-110 transition-all">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* COPYRIGHT BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
          <p>© 2025 Anvi Studio. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="text-gray-700">Handcrafted in India</span>
            <span className="text-gray-700">Powered by React & Spring</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;