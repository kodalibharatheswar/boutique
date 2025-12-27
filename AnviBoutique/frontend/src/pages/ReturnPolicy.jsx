import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, 
  CheckCircle2, 
  Tag, 
  Truck, 
  Mail, 
  AlertTriangle, 
  ArrowLeft, 
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* 1. HERO HEADER */}
      <header className="bg-white border-b border-gray-100 py-16 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm border border-orange-100">
            <RotateCcw size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 italic">
            Return & Exchange Policy
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            At Anvi Studio, we strive for perfection. If your handcrafted selection isn't quite right, we're here to help make it better.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Last Updated: January 2025</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Standard Protocol</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12 space-y-10">
        
        {/* SECTION 1: Eligibility */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">1. Eligibility Criteria</h2>
            </div>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                We accept returns or exchanges only if the product received falls into the following categories:
              </p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Damaged or Defective items",
                  "Incorrect size delivered",
                  "Incorrect color/design shipped",
                  "Missing components/accessories"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium">
                    <ShieldCheck size={16} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                <Clock className="text-amber-600 shrink-0 mt-1" size={20} />
                <div>
                  <span className="font-bold text-amber-900 block mb-1 uppercase text-[10px] tracking-widest">Time Frame</span>
                  <p className="text-sm text-amber-800">
                    You must notify our customer support team of any issues within <strong>7 days</strong> of the delivery date.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex gap-4">
                <AlertTriangle className="text-red-600 shrink-0 mt-1" size={20} />
                <div>
                  <span className="font-bold text-red-900 block mb-1 uppercase text-[10px] tracking-widest">Exclusions</span>
                  <p className="text-sm text-red-800 italic">
                    Customized, altered, or stitched items are <strong>not eligible</strong> for return or exchange unless a manufacturing defect is proven.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Item Condition */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="p-5 bg-purple-50 text-purple-600 rounded-[2rem] border border-purple-100 shrink-0">
                <Tag size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Condition of Item</h2>
                <p className="text-gray-600 leading-relaxed">
                  To be eligible for a return, the item must be <strong>unused, unwashed, and unworn</strong>. 
                  It must be returned with all original tags, packaging, and accessories intact. 
                  Items returned without original tags will unfortunately not be accepted for processing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: The Process */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                <Truck size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">3. Return Process</h2>
            </div>
            
            <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {[
                { 
                  icon: Mail, 
                  title: "Initiate Request", 
                  text: "Email us at avnistudio@gmail.com with your Order ID and photographic evidence of the defect or damage." 
                },
                { 
                  icon: RotateCcw, 
                  title: "Approval & Pick-up", 
                  text: "Once approved, our logistics partner will arrange for a reverse pick-up from your address within 3-5 business days." 
                },
                { 
                  icon: CheckCircle2, 
                  title: "Inspection & Resolution", 
                  text: "After quality inspection, we will process your full refund or ship the exchange item. Refunds typically reflect in 5-10 business days." 
                }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-14 group">
                  <div className="absolute left-0 top-0 w-12 h-12 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:border-orange-200 group-hover:text-orange-500 transition-all z-10 shadow-sm">
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
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
          <p className="text-xs text-gray-400 font-medium">Questions? Contact support at anvistudio6@gmail.com</p>
        </div>

      </main>
    </div>
  );
};

export default ReturnPolicy;