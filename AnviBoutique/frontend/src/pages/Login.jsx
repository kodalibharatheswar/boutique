import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ArrowRight
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get potential success messages from navigation state (e.g., after registration)
  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Spring Security default login expects form-urlencoded data
      const params = new URLSearchParams();
      params.append('username', formData.username);
      params.append('password', formData.password);

      // POST to your Spring Boot login endpoint
      // Note: If you haven't created a custom /api/auth/login, Spring uses /login
      await axios.post('http://localhost:8080/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      });

      // On success, redirect to dashboard or the intended page
      // In a real app, you might fetch user info here to determine roles
      navigate('/customer/dashboard');
      
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else if (err.response?.data?.error === 'unverified') {
        setError("Your account is not verified. Please check your email for the OTP.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full">
        
        {/* BRAND LOGO AREA */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="bg-white p-2 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
              <img src="/assets/Chaknik_Logo.png" alt="Anvi Studio" className="h-12 w-auto" />
            </div>
            <span className="text-2xl font-serif font-bold italic text-gray-900">Anvi Studio</span>
          </Link>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Customer Login</h1>
            <p className="text-gray-400 text-sm mb-8 italic">Welcome back to your favorite boutique.</p>

            {/* STATUS MESSAGES */}
            {successMessage && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                <CheckCircle2 size={20} />
                <p className="text-xs font-medium">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                <AlertCircle size={20} />
                <div>
                  <p className="text-xs font-medium">{error}</p>
                  {error.includes('verified') && (
                    <Link to="/confirm-otp" className="text-xs font-bold underline mt-1 block">Verify Now</Link>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Email or Phone</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input 
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-gray-800"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl pl-12 pr-12 py-4 outline-none transition-all text-gray-800"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <LogIn size={20} /> Login to Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <p className="text-sm text-gray-500">
                New to Anvi Studio? {' '}
                <Link to="/register" className="text-orange-600 font-bold hover:text-orange-700 inline-flex items-center gap-1 group">
                  Create an account <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ADMIN SHORTCUT */}
        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">
          Administrator? <Link to="/admin" className="text-gray-600 hover:text-orange-500 transition-colors">Access Portal</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;