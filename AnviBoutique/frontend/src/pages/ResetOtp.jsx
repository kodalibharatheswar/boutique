import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Key, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const ResetOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve email from ForgotPassword.jsx navigation state
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Redirect if no email context is found
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create search params for @RequestParam handling in AuthRestController
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('otp', otp);

      const response = await axios.post('http://localhost:8080/api/auth/verify-reset-otp', params);

      setSuccess(response.data.message);
      
      // On success, redirect to the final password change page
      // Passing both email and the verified OTP to the next step for security
      setTimeout(() => {
        navigate('/reset-password', { state: { email, otp } });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full">
        {/* OTP CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-center">
          
          <div className="p-8 md:p-12">
            {/* ICON & HEADER */}
            <div className="mb-8">
              <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm">
                <Key size={36} />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 italic">OTP Validation</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                A security code was sent to your registered email: <br />
                <span className="font-bold text-gray-800 break-all">{email}</span>
              </p>
            </div>

            {/* STATUS MESSAGES */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs font-medium text-left">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex items-center gap-3 animate-in fade-in">
                <CheckCircle size={20} className="shrink-0" />
                <p className="text-xs font-medium text-left">{success}</p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <input 
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numeric only
                  placeholder="------"
                  className="w-full text-center text-4xl tracking-[1rem] font-bold py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-800 placeholder:text-gray-200"
                  disabled={loading || !!success}
                />
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                  <ShieldCheck size={12} /> Secure Verification
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  type="submit" 
                  disabled={loading || !!success || otp.length < 6}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Validate OTP Code"
                  )}
                </button>

                <button 
                  type="button"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center justify-center gap-2 mx-auto transition-colors"
                  onClick={() => alert("Requesting new OTP...")}
                >
                  <RefreshCw size={14} /> Resend Code
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50">
              <Link 
                to="/login" 
                className="text-gray-400 hover:text-orange-500 font-bold text-xs inline-flex items-center gap-2 transition-all uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Cancel Recovery
              </Link>
            </div>
          </div>
        </div>

        {/* HELP TEXT */}
        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
          For your security, this code will expire in <span className="text-gray-600 font-bold">5 minutes</span>. <br />
          Didn't receive the email? Check your spam or promotions folder.
        </p>
      </div>
    </div>
  );
};

export default ResetOtp;