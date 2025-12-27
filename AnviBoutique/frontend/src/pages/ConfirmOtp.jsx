import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MailCheck, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ConfirmOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from previous page state (Register) or URL query
  const queryParams = new URLSearchParams(location.search);
  const [email, setEmail] = useState(location.state?.email || queryParams.get('email') || '');
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // If no email is found, the user shouldn't be here
  useEffect(() => {
    if (!email) {
      setError("No email found for verification. Please register again.");
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create form data as the API expects @RequestParam
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('otp', otp);

      const response = await axios.post('http://localhost:8080/api/auth/confirm-otp', params, {
        withCredentials: true
      });

      setSuccess(response.data.message);
      // Redirect to login after a brief delay
      setTimeout(() => navigate('/login'), 2500);

    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 text-center">
        
        {/* ICON & TITLE */}
        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <MailCheck className="text-orange-500" size={40} />
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Verify Your Email</h1>
        <p className="text-gray-500 text-sm mb-8">
          We've sent a 6-digit verification code to <br />
          <span className="font-bold text-gray-800">{email || 'your email'}</span>
        </p>

        {/* ALERTS */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 border border-red-100 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs font-medium text-left">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 border border-green-100">
            <CheckCircle2 size={20} className="shrink-0" />
            <p className="text-xs font-medium text-left">{success}</p>
          </div>
        )}

        {/* OTP FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
              placeholder="------"
              className="w-full text-center text-3xl tracking-[1rem] font-bold py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-0 outline-none transition-all placeholder:text-gray-200"
              required
              disabled={loading || !!success}
            />
            <p className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Expires in 5 minutes
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !!success || !email}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-50 flex flex-col gap-4">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOtp;