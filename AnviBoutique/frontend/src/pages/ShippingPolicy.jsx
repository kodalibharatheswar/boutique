import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Clock, 
  MapPin, 
  Mail, 
  Package, 
  ArrowLeft, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* 1. HERO HEADER */}
      <header className="bg-white border-b border-gray-100 py-16 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm border border-orange-100">
            <Truck size={32} className="animate-in slide-in-from-left duration-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 italic">
            Shipping & Delivery Policy
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From our studio to your doorstep. Learn about our carefully managed logistics to ensure your handcrafted attire arrives safely.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Last Updated: January 2025</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Domestic Shipping Only</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12 space-y-10">
        
        {/* SECTION 1: Processing Time */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Clock size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">1. Processing Time</h2>
            </div>
            
            <div className="space-y-6 text-gray-600 leading-relaxed text-center md:text-left">
              <p className="text-lg">
                Most orders are prepared for dispatch within <strong className="text-gray-900">1-3 business days</strong>.
              </p>
              
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center md:items-start">
                <Zap className="text-orange-500 shrink-0 mt-1" size={20} />
                <div>
                  <span className="font-bold text-gray-800 block mb-1 uppercase text-[10px] tracking-widest">Custom Orders Note</span>
                  <p className="text-sm">
                    Items involving custom stitching, embroidery, or pre-orders may require additional time. We will communicate the estimated completion date personally via your registered email or WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Rates & Estimates */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">2. Rates & Delivery Estimates</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 text-center flex flex-col items-center">
                <ShieldCheck size={28} className="text-orange-600 mb-3" />
                <span className="text-[10px] font-black text-orange-400 uppercase mb-2">Standard</span>
                <span className="text-lg font-bold text-orange-900">4-7 Days</span>
                <p className="text-[10px] text-orange-600 mt-2">Across major Indian cities</p>
              </div>

              <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100 text-center flex flex-col items-center">
                <Zap size={28} className="text-green-600 mb-3" />
                <span className="text-[10px] font-black text-green-400 uppercase mb-2">Free Shipping</span>
                <span className="text-lg font-bold text-green-900">Orders {'>'} ₹1999</span>
                <p className="text-[10px] text-green-600 mt-2">Use code: FREESHIP</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 text-center flex flex-col items-center">
                <MapPin size={28} className="text-slate-600 mb-3" />
                <span className="text-[10px] font-black text-slate-400 uppercase mb-2">Service Area</span>
                <span className="text-lg font-bold text-slate-900">Pan India</span>
                <p className="text-[10px] text-slate-600 mt-2">Tracking provided for all</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl text-xs font-medium border border-blue-100 italic">
              <Info size={16} className="shrink-0" />
              <span>Exact shipping costs for orders below the threshold are calculated automatically during the final checkout stage based on weight and destination.</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: Tracking */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="p-5 bg-green-50 text-green-600 rounded-[2rem] border border-green-100 shrink-0">
                <Package size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Order Tracking</h2>
                <p className="text-gray-600 leading-relaxed">
                  As soon as your package leaves our studio, we will send you a shipment confirmation email. 
                  This will include your <strong className="text-gray-900">Tracking Number</strong> and a direct link to our logistics partner's portal so you can monitor your order's journey in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM ACTION */}
        <div className="flex flex-col items-center gap-6 pt-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold transition-all hover:gap-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Return to Homepage
          </Link>
          <div className="h-px w-20 bg-slate-200"></div>
          <p className="text-xs text-gray-400 font-medium italic">Handcrafted with care, Delivered with pride.</p>
        </div>

      </main>
    </div>
  );
};

export default ShippingPolicy;