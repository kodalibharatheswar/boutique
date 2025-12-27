import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Unlock, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve context passed from ResetOtp.jsx
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Security: Redirect back if accessed without OTP verification context
  useEffect(() => {
    if (!email || !otp) {
      navigate('/forgot-password');
    }
  }, [email, otp, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { newPassword, confirmPassword } = formData;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return "Password must be 8+ characters and contain at least one uppercase letter, one lowercase letter, and one number.";
    }
    if (newPassword !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // POST to the finalized endpoint in AuthRestController
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
        email,
        otp, // Including OTP for backend-side final verification
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      setSuccess(response.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. The link or OTP may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full">
        
        {/* CARD CONTAINER */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          
          <div className="p-8 md:p-12 text-center">
            {/* ICON & HEADER */}
            <div className="mb-8">
              <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm border border-orange-100 animate-in zoom-in duration-500">
                <Unlock size={36} />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 italic">Set New Password</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Resetting credentials for: <br />
                <span className="font-bold text-gray-800 break-all">{email}</span>
              </p>
            </div>

            {/* STATUS MESSAGES */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-start gap-3 text-left animate-in fade-in">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-xs font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex items-center gap-3 text-left animate-in fade-in">
                <CheckCircle2 size={20} className="shrink-0" />
                <p className="text-xs font-medium">{success} Redirecting to login...</p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 ml-1">New Password</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl px-6 py-4 outline-none transition-all text-gray-800"
                    placeholder="••••••••"
                    disabled={loading || !!success}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2 px-1">
                  <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-orange-500 transition-all duration-500 ${formData.newPassword.length >= 8 ? 'w-full' : 'w-1/3'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min 8 Chars</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 ml-1">Confirm New Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl px-6 py-4 outline-none transition-all text-gray-800"
                  placeholder="••••••••"
                  disabled={loading || !!success}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !!success || !formData.newPassword}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={18} className="text-orange-500" />
                    Reset My Password
                  </>
                )}
              </button>
            </form>

            {/* TRUST FOOTER */}
            <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
              <ShieldCheck size={12} />
              PCI-DSS Secure Reset
            </div>
          </div>
        </div>

        {/* HELP TEXT */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Remembered your password? {' '}
          <Link to="/login" className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1 group">
            Return to Login <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;