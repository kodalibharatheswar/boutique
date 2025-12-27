import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  Home, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const VerificationResult = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Logic to determine status from URL query (?message=...) or navigation state
  const resultMessage = location.state?.message || searchParams.get('message') || '';
  const isSuccess = resultMessage.toLowerCase().includes('successful') || location.state?.success;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full">
        
        {/* RESULT CARD */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden text-center">
          <div className="p-8 md:p-12">
            
            {isSuccess ? (
              /* SUCCESS STATE */
              <div className="animate-in zoom-in duration-500">
                <div className="bg-green-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-green-500 shadow-sm border border-green-100">
                  <CheckCircle2 size={48} />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4 italic">
                  Identity Verified!
                </h1>
                <div className="h-1 w-12 bg-green-500 mx-auto rounded-full mb-6"></div>
                <p className="text-gray-500 text-lg leading-relaxed mb-10">
                  {resultMessage || "Your account has been successfully activated. Welcome to the Anvi Studio family."}
                </p>
                
                <Link 
                  to="/login" 
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 group"
                >
                  <LogIn size={20} className="text-orange-500" />
                  Proceed to Login
                </Link>
              </div>
            ) : (
              /* FAILURE STATE */
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-red-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red-500 shadow-sm border border-red-100">
                  <XCircle size={48} />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4 italic">
                  Verification Failed
                </h1>
                <div className="h-1 w-12 bg-red-400 mx-auto rounded-full mb-6"></div>
                <p className="text-gray-500 text-lg leading-relaxed mb-10">
                  {resultMessage || "We couldn't verify your account. The link may have expired or the code was incorrect."}
                </p>
                
                <div className="space-y-4">
                  <Link 
                    to="/confirm-otp" 
                    className="w-full bg-orange-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-100"
                  >
                    Try Another Code
                  </Link>
                  <Link 
                    to="/login" 
                    className="w-full bg-white border-2 border-gray-100 text-gray-700 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                  >
                    <ArrowLeft size={18} className="text-gray-400" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}

            {/* TRUST FOOTER */}
            <div className="mt-10 pt-8 border-t border-gray-50">
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                <ShieldCheck size={12} />
                Secure Account Protocol
              </div>
            </div>
          </div>
        </div>

        {/* HOME LINK */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-orange-500 font-bold text-xs inline-flex items-center gap-2 transition-all uppercase tracking-widest"
          >
            <Home size={14} /> Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerificationResult;