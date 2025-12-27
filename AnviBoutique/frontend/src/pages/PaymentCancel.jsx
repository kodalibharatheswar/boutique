import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  ShoppingCart, 
  ArrowRight, 
  ChevronLeft,
  PackageSearch
} from 'lucide-react';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-xl w-full">
        {/* CARD CONTAINER */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-center">
          
          <div className="p-8 md:p-12">
            {/* ICON & STATUS */}
            <div className="mb-8">
              <div className="bg-amber-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-sm border border-amber-100">
                <AlertTriangle size={48} />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 italic">
                Payment Cancelled
              </h1>
              <div className="h-1 w-12 bg-amber-400 mx-auto rounded-full mb-6"></div>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm mx-auto">
                Your payment was not completed. Don't worry—your selected items are still safely saved in your shopping cart.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4">
              <Link 
                to="/cart" 
                className="w-full bg-orange-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 group"
              >
                <ShoppingCart size={20} className="group-hover:-translate-x-1 transition-transform" />
                Return to My Cart
              </Link>

              <Link 
                to="/products" 
                className="w-full bg-white border-2 border-gray-100 text-gray-700 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all group"
              >
                <PackageSearch size={20} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                Continue Browsing Collections
              </Link>
            </div>

            {/* HELP TEXT */}
            <div className="mt-10 pt-8 border-t border-gray-50">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Need Assistance?</p>
              <p className="text-sm text-gray-500">
                If you encountered a technical issue, please reach out to us at <br />
                <span className="font-bold text-gray-800">anvistudio6@gmail.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER LINK */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-orange-500 font-bold text-xs inline-flex items-center gap-2 transition-all uppercase tracking-widest"
          >
            <ChevronLeft size={14} /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;