import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Lock, 
  Send, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Mail,
  Smartphone
} from 'lucide-react';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create search params for @RequestParam handling in AuthRestController
      const params = new URLSearchParams();
      params.append('identifier', identifier);

      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', params);

      setSuccess(response.data.message);
      
      // After 2 seconds, redirect to the OTP verification page
      // Pass the actual email (returned by backend) to the next page via state
      setTimeout(() => {
        navigate('/reset-otp', { state: { email: response.data.email } });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "We couldn't process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full">
        {/* CARD CONTAINER */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          
          <div className="p-8 md:p-12">
            {/* ICON & HEADER */}
            <div className="text-center mb-8">
              <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm">
                <Lock size={40} />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 italic">Forgot Password?</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enter your registered email or phone number. We'll send you a 6-digit code to reset your password.
              </p>
            </div>

            {/* STATUS MESSAGES */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in zoom-in duration-200">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex items-center gap-3 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 size={20} className="shrink-0" />
                <p className="text-xs font-medium">{success}</p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Account Identifier</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors">
                    {identifier.includes('@') ? <Mail size={20} /> : <Smartphone size={20} />}
                  </div>
                  <input 
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or Phone Number (+91...)"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-gray-800"
                    disabled={loading || !!success}
                  />
                </div>
                <p className="text-[10px] text-gray-400 italic ml-1">Must be your registered account email or mobile.</p>
              </div>

              <button 
                type="submit" 
                disabled={loading || !!success || !identifier}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Send Verification Code
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <Link 
                to="/login" 
                className="text-orange-600 hover:text-orange-700 font-bold text-sm inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* HELP TEXT */}
        <p className="mt-8 text-center text-gray-400 text-xs px-10">
          If you no longer have access to your registered email or phone, please contact our support team at <span className="text-gray-600 font-medium">anvistudio6@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;