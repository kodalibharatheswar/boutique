import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  ShoppingBag, 
  ChevronRight, 
  Package, 
  PartyPopper,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const [referenceId, setReferenceId] = useState('');

  useEffect(() => {
    // Attempt to get a reference ID from navigation state or URL params
    const queryParams = new URLSearchParams(location.search);
    const id = location.state?.sessionId || queryParams.get('session_id') || 'ANVI-REF-' + Math.floor(Math.random() * 1000000);
    setReferenceId(id);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-xl w-full">
        {/* SUCCESS CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-center">
          <div className="p-8 md:p-12">
            
            {/* CELEBRATION ICON */}
            <div className="relative mb-8">
              <div className="bg-green-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto text-green-500 shadow-sm border border-green-100 animate-in zoom-in duration-500">
                <CheckCircle size={48} />
              </div>
              <div className="absolute top-0 right-1/4 animate-bounce delay-100">
                <PartyPopper size={24} className="text-orange-400 opacity-60" />
              </div>
            </div>

            {/* MESSAGE */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 italic">
                Order Placed Successfully!
              </h1>
              <div className="h-1 w-12 bg-green-500 mx-auto rounded-full mb-6"></div>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm mx-auto">
                Thank you for shopping with us. Your handcrafted outfit is now being prepared for its journey to you.
              </p>
            </div>

            {/* CONFIRMATION INFO */}
            <div className="bg-slate-50 rounded-3xl p-6 mb-10 border border-slate-100">
              <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                <ClipboardList size={14} />
                Order Reference
              </div>
              <p className="font-mono text-lg font-bold text-slate-700 tracking-wider">
                {referenceId}
              </p>
              <p className="text-[10px] text-slate-400 mt-2 italic">
                A confirmation email has been sent to your registered address.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4">
              <Link 
                to="/customer/orders" 
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 group"
              >
                <Package size={20} className="text-orange-500" />
                Track My Orders
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                to="/" 
                className="w-full bg-white border-2 border-gray-100 text-gray-700 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all group"
              >
                <ShoppingBag size={20} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* BOTTOM BANNER */}
          <div className="bg-orange-50 py-4 px-8 border-t border-orange-100 flex items-center justify-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Share your style</span>
            <div className="flex gap-4">
              {/* Simple mock social text or small dots for aesthetic */}
              <span className="text-[10px] font-bold text-orange-300">#AnviStudio</span>
            </div>
          </div>
        </div>

        {/* HELP FOOTER */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Having trouble? Contact us at <span className="font-bold text-gray-600">anvistudio6@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;