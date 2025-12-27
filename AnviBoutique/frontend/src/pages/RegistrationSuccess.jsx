import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Mail, 
  ArrowRight, 
  Home, 
  PartyPopper,
  ShieldCheck
} from 'lucide-react';

const RegistrationSuccess = () => {
  const location = useLocation();
  // Retrieves the email passed from the Register page via navigate state
  const email = location.state?.email || 'your email address';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full">
        
        {/* SUCCESS CARD */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden text-center relative">
          
          {/* Subtle Decorative Background Icon */}
          <div className="absolute -top-10 -right-10 opacity-5 text-orange-500 pointer-events-none">
            <PartyPopper size={200} />
          </div>

          <div className="p-8 md:p-12 relative z-10">
            {/* ICON & TITLE */}
            <div className="mb-8">
              <div className="bg-green-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-500 shadow-sm border border-green-100 animate-in zoom-in duration-500">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 italic">
                Welcome to the Circle!
              </h1>
              <div className="h-1 w-12 bg-green-500 mx-auto rounded-full mb-6"></div>
              <p className="text-gray-500 text-lg leading-relaxed">
                Your account has been created successfully. We're thrilled to have you with us at Anvi Studio!
              </p>
            </div>

            {/* VERIFICATION STATUS BOX */}
            <div className="bg-slate-50 rounded-3xl p-6 mb-10 border border-slate-100 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-xl text-orange-500 shadow-sm">
                  <Mail size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Action Required</span>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                A unique 6-digit verification code has been sent to: <br />
                <span className="font-bold text-gray-900 break-all">{email}</span>
              </p>
              
              <p className="text-[10px] text-gray-400 italic leading-snug">
                Please enter this code on the next screen to verify your identity and activate your account.
              </p>
            </div>

            {/* PRIMARY ACTION BUTTONS */}
            <div className="space-y-4">
              <Link 
                to="/confirm-otp" 
                state={{ email }}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 group"
              >
                Verify My Account
                <ArrowRight size={20} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                to="/" 
                className="w-full bg-white border-2 border-gray-100 text-gray-700 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
              >
                <Home size={18} className="text-gray-400" />
                Explore Collections
              </Link>
            </div>

            {/* TRUST FOOTER */}
            <div className="mt-10 pt-8 border-t border-gray-50">
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                <ShieldCheck size={12} />
                Secure Registration Protocol
              </div>
            </div>
          </div>
        </div>

        {/* TROUBLESHOOTING LINK */}
        <p className="mt-8 text-center text-xs text-gray-400 px-10">
          Didn't receive the code? Please check your spam folder or reach out to us at <span className="font-bold text-gray-600">anvistudio6@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;