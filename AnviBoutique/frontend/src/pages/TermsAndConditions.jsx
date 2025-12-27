import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  ShieldCheck, 
  ShoppingBag, 
  UserCheck, 
  ArrowLeft, 
  ChevronRight,
  Info,
  FileText
} from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* 1. HERO HEADER */}
      <header className="bg-white border-b border-gray-100 py-16 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm border border-orange-100">
            <Scale size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 italic">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using Anvi Studio. By accessing our boutique, you agree to follow the guidelines that protect both you and our artisans.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Last Updated: January 2025</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Agreement Version 2.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12 space-y-10">
        
        {/* SECTION 1: Acceptance */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                By accessing or using the Anvi Studio website (the "Service"), you agree to be bound by these Terms and Conditions. This agreement applies to all visitors, users, and others who access or use the Service.
              </p>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 font-medium">
                  If you disagree with any part of these terms, you may not access the Service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Products & Services */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <ShoppingBag size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">2. Products and Services</h2>
            </div>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Anvi Studio specializes in handpicked ethnic wear. Due to the handcrafted nature of our products, small variations in weave, color, and finish are a signature of authenticity and are not considered defects.
              </p>
              
              <ul className="grid grid-cols-1 gap-4">
                {[
                  { label: "Pricing & Availability", text: "Descriptions of products or pricing are subject to change without notice. We reserve the right to discontinue any product at any time." },
                  { label: "Color Accuracy", text: "We make every effort to display colors as accurately as possible, but we cannot guarantee that your device's display accurately reflects the true color." },
                  { label: "Modifications", text: "We reserve the right to limit the sales of our products to any person, geographic region, or jurisdiction." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1.5 p-1 bg-orange-100 text-orange-600 rounded-full group-hover:scale-110 transition-transform">
                      <ChevronRight size={12} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 block text-sm">{item.label}</span>
                      <p className="text-gray-500 text-sm">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: User Accounts */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="p-5 bg-green-50 text-green-600 rounded-[2rem] border border-green-100 shrink-0">
                <UserCheck size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. User Accounts</h2>
                <p className="text-gray-600 leading-relaxed">
                  When you create an account with us, you must provide information that is accurate, complete, and current. 
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. 
                  Anvi Studio cannot and will not be liable for any loss or damage arising from your failure to comply with account security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM ACTION */}
        <div className="flex flex-col items-center gap-6 pt-10">
          <div className="flex items-center gap-3 text-gray-400">
            <FileText size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Legal Framework Certified</span>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold transition-all hover:gap-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Return to Homepage
          </Link>
          <div className="h-px w-20 bg-slate-200"></div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">© 2025 Anvi Studio Boutique</p>
        </div>

      </main>
    </div>
  );
};

export default TermsAndConditions;