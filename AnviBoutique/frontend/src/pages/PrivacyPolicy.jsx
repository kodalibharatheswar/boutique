import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Database, 
  Eye, 
  Lock, 
  ArrowLeft, 
  ChevronRight,
  UserCheck,
  FileText
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* 1. HERO HEADER */}
      <header className="bg-white border-b border-gray-100 py-16 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 italic">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Your trust is our most valuable thread. Learn how Anvi Studio protects and manages your personal information.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Last Updated: January 2025</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Version 1.2</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12 space-y-10">
        
        {/* SECTION 1: Collection */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Database size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                We collect information you provide directly to us when you interact with Anvi Studio. This typically occurs when you create an account, place an order, subscribe to our newsletter, or contact our support team.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-gray-800 block mb-1">Identity Data</span>
                  <p className="text-xs">Name, Email address, Phone number, and Shipping/Billing address.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-gray-800 block mb-1">Transaction Data</span>
                  <p className="text-xs">Details about payments and products you have purchased from us.</p>
                </div>
              </div>

              <p className="text-sm italic">
                <strong>Usage Data:</strong> We also automatically collect data about your device and how you interact with our boutique website, including IP addresses and browser types, to improve your browsing experience.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Usage */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">2. How We Use Your Data</h2>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Anvi Studio uses the collected information to ensure a seamless shopping journey and to maintain the security of our platform.
            </p>

            <ul className="grid grid-cols-1 gap-4">
              {[
                { label: "Order Fulfillment", text: "Processing payments, arranging shipping, and providing invoices." },
                { label: "Account Management", text: "Verifying your identity and managing your loyalty rewards." },
                { label: "Communication", text: "Sending updates on your order status and responding to your inquiries." },
                { label: "Experience Polish", text: "Improving our website layouts and curating product recommendations." }
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
        </section>

        {/* SECTION 3: Security */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="p-5 bg-green-50 text-green-600 rounded-[2rem] border border-green-100 shrink-0">
                <Lock size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">3. Data Security & Integrity</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement industry-standard security measures to maintain the safety of your personal data. 
                  All passwords are encrypted using strong hashing algorithms and are never stored in plaintext. 
                  <strong> We do not sell, trade, or rent your personally identifiable information to third parties.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM ACTION */}
        <div className="flex flex-col items-center gap-6 pt-10">
          <div className="flex items-center gap-3 text-gray-400">
            <UserCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Certified Privacy Protected</span>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold transition-all hover:gap-4"
          >
            <ArrowLeft size={18} />
            Return to Homepage
          </Link>
        </div>

      </main>
    </div>
  );
};

export default PrivacyPolicy;