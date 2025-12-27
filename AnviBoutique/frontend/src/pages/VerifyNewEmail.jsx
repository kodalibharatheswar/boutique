import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const VerifyNewEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve the new email from the navigation state passed from Profile.jsx
  const [newEmail, setNewEmail] = useState(location.state?.newEmail || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Security: Redirect back if accessed without the new email context
  useEffect(() => {
    if (!newEmail) {
      navigate('/customer/profile');
    }
  }, [newEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // POST to the email change finalization endpoint
      // Adjust the URL if your REST controller uses a different path
      const response = await axios.post('http://localhost:8080/api/customer/profile/change-email/finalize', {
        newEmail,
        otp
      }, { withCredentials: true });

      setSuccess(response.data.message || "Your email address has been updated successfully.");
      
      // Redirect back to profile after showing success message
      setTimeout(() => {
        navigate('/customer/profile');
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    // In a real app, you would call an API to trigger the OTP again
    alert("A new verification code has been sent to " + newEmail);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full">
        
        {/* VERIFICATION CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            
            {/* ICON & HEADER */}
            <div className="mb-8">
              <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm border border-orange-100 animate-in zoom-in duration-500">
                <Lock size={36} />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 italic">Confirm Email</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                We've sent a secure code to your new address: <br />
                <span className="font-bold text-gray-800 break-all">{newEmail}</span>
              </p>
            </div>

            {/* STATUS MESSAGES */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-left animate-in fade-in">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex items-center gap-3 text-left animate-in fade-in">
                <CheckCircle2 size={20} className="shrink-0" />
                <p className="text-xs font-medium">{success}</p>
              </div>
            )}

            {/* OTP FORM */}
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
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                  <ShieldCheck size={12} /> Encrypted Verification
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  type="submit" 
                  disabled={loading || !!success || otp.length < 6}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Confirm Email Change"
                  )}
                </button>

                <button 
                  type="button"
                  onClick={handleResend}
                  disabled={loading || !!success}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-30"
                >
                  <RefreshCw size={14} /> Resend Verification Code
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50">
              <Link 
                to="/customer/profile" 
                className="text-gray-400 hover:text-orange-500 font-bold text-xs inline-flex items-center gap-2 transition-all uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Cancel & Return to Profile
              </Link>
            </div>
          </div>
        </div>

        {/* SECURITY NOTE */}
        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed px-6">
          This code is valid for <span className="text-gray-600 font-bold">5 minutes</span>. <br />
          If you didn't request this change, please secure your account immediately.
        </p>
      </div>
    </div>
  );
};

export default VerifyNewEmail;