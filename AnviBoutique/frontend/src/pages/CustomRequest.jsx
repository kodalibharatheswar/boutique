import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  Sparkles, 
  Palette, 
  Camera, 
  PhoneCall,
  ArrowRight
} from 'lucide-react';

const CustomRequest = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20">
      {/* HERO HEADER */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 italic">
            Customization Request
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Bring your dream attire to life. From specific fabrics to unique color palettes, we specialize in creating outfits as unique as you.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-white">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* LEFT SIDE: STEPS/INFO */}
            <div className="md:col-span-7 p-8 md:p-12 space-y-10">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">How it Works</h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl h-fit">
                      <Palette size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Share Your Vision</h4>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1">
                        Struggling to find a specific color or have a unique pattern in mind? Tell us what you're looking for.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-purple-50 text-purple-600 p-3 rounded-xl h-fit">
                      <Camera size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Send Inspiration</h4>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1">
                        Found a design online or in a magazine? Share the photos with us to help us understand your style.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-green-50 text-green-600 p-3 rounded-xl h-fit">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Tailored Perfection</h4>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1">
                        Whether it's your big day outfit or a special event ensemble, we'll suggest the best fabrics and cuts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <p className="text-red-700 text-sm font-medium flex items-start gap-2">
                  <span className="font-bold uppercase text-[10px] bg-red-100 px-2 py-0.5 rounded mt-0.5">Note</span>
                  For faster communication, please include design inspiration photos and your contact number in your reach-out.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: CONTACT CHANNELS */}
            <div className="md:col-span-5 bg-gray-900 p-8 md:p-12 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-serif font-bold mb-8 italic">Let's Connect</h3>
              
              <div className="space-y-4">
                <a 
                  href="https://www.instagram.com/avnistudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-pink-500/20 p-2 rounded-lg text-pink-400">
                      <Instagram size={20} />
                    </div>
                    <span className="font-medium">Instagram DM</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>

                <a 
                  href="https://www.facebook.com/bharatheswar.kodali/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                      <Facebook size={20} />
                    </div>
                    <span className="font-medium">Facebook</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>

                <a 
                  href="mailto:aanyasriboutique@gmail.com" 
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
                      <Mail size={20} />
                    </div>
                    <span className="font-medium">Email Us</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>

                <div className="pt-8 border-t border-white/10 mt-8">
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold mb-2">Speak to a Stylist</p>
                  <div className="flex items-center gap-3 text-orange-400 text-xl font-serif font-bold">
                    <PhoneCall size={24} />
                    +91 94903 34557
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <p className="mt-12 text-center text-gray-400 italic text-sm">
          "We would love to see your dream dress take shape! 😊"
        </p>
      </main>
    </div>
  );
};

export default CustomRequest;