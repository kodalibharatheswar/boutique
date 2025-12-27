import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Ticket, 
  Copy, 
  CheckCircle, 
  Calendar, 
  Info, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Tag
} from 'lucide-react';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/customer/coupons', {
        withCredentials: true
      });
      setCoupons(response.data);
    } catch (err) {
      setError("Unable to load active offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copy to clipboard helper using execCommand as recommended for iFrame environments.
   */
  const handleCopyCode = (code) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedCode(code);
      // Reset the "Copied" status after 3 seconds
      setTimeout(() => setCopiedCode(null), 3000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium tracking-wide">Checking for active offers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header Area */}
      <header className="bg-white border-b border-gray-200 py-12 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <Link to="/customer/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4 font-bold transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Profile
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 italic">Exclusive Offers</h1>
              <p className="text-gray-500 mt-2 text-lg">Handpicked rewards for our valued boutique customers.</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-3xl text-orange-600 hidden md:block">
              <Ticket size={48} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12">
        {error && (
          <div className="mb-8 bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 flex items-center gap-4">
            <AlertCircle size={24} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {coupons.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-20 text-center max-w-2xl mx-auto">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Tag size={48} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4 italic">No Offers Right Now</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              We are currently preparing some special festive discounts for you. Stay tuned and check back soon!
            </p>
            <Link to="/products" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row"
              >
                {/* Visual "Stub" */}
                <div className="bg-orange-500 md:w-24 p-6 flex items-center justify-center text-white shrink-0">
                  <div className="flex flex-col items-center gap-1 md:-rotate-90 md:whitespace-nowrap">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">Value</span>
                    <span className="text-2xl font-bold">
                      {coupon.discountType === 'PERCENT' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{coupon.description}</h3>
                      <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        Active
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500 gap-2">
                        <Calendar size={14} className="text-orange-400" />
                        <span>Expires: <span className="font-bold text-gray-700">{new Date(coupon.expiryDate).toLocaleDateString()}</span></span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400 gap-2 italic">
                        <Info size={14} />
                        <span>Apply code at checkout to redeem offer.</span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="mt-8 pt-6 border-t border-dashed border-gray-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                      <div className="bg-gray-50 border-2 border-dashed border-orange-200 rounded-xl px-4 py-3 flex items-center justify-between group">
                        <span className="font-mono text-xl font-bold text-gray-800 tracking-widest uppercase">
                          {coupon.code}
                        </span>
                        <button 
                          onClick={() => handleCopyCode(coupon.code)}
                          className={`p-2 rounded-lg transition-all ${
                            copiedCode === coupon.code 
                            ? 'bg-green-500 text-white' 
                            : 'hover:bg-white text-orange-500 hover:shadow-sm'
                          }`}
                          title="Copy Code"
                        >
                          {copiedCode === coupon.code ? <CheckCircle size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                      {copiedCode === coupon.code && (
                        <p className="text-[10px] text-green-600 font-bold uppercase mt-2 text-center animate-pulse">
                          Code copied to clipboard!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Coupons;