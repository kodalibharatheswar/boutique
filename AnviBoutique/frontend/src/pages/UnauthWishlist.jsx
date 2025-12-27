import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ShoppingBag, 
  ArrowRight, 
  LogIn, 
  UserPlus,
  Sparkles
} from 'lucide-react';

const UnauthWishlist = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center">
          
          {/* EMPTY STATE ICON */}
          <div className="relative inline-block mb-10">
            <div className="bg-white w-32 h-32 rounded-[2.5rem] shadow-xl flex items-center justify-center text-gray-200 border border-gray-100 animate-in zoom-in duration-700">
              <ShoppingCart size={64} strokeWidth={1} />
            </div>
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-xl shadow-lg animate-bounce">
              <Sparkles size={20} />
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 italic">
              Your cart is empty
            </h1>
            <div className="h-1 w-16 bg-orange-500 mx-auto rounded-full"></div>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              It looks like you haven't added any handcrafted pieces to your cart yet. Browse our collections to find your perfect match.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/products" 
              className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 group"
            >
              <ShoppingBag size={20} className="text-orange-500" />
              Start Shopping
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* ACCOUNT PROMPT */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">
              Already have an account?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              <Link 
                to="/login" 
                className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <LogIn size={20} />
                  </div>
                  <span className="font-bold text-gray-800">Login</span>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
              </Link>

              <Link 
                to="/register" 
                className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <UserPlus size={20} />
                  </div>
                  <span className="font-bold text-gray-800">Sign Up</span>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </Link>
            </div>
            
            <p className="mt-10 text-[10px] text-gray-400 italic">
              Log in to sync your cart across all your devices and checkout faster.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

// Helper for the icon within the cards
const ChevronRight = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" width={size} height={size} 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default UnauthWishlist;