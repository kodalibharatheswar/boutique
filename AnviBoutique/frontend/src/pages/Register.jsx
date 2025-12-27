import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Smartphone,
  User,
  Calendar,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '', // email
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    preferredSize: '',
    gender: '',
    dateOfBirth: '',
    termsAccepted: false,
    newsletterOptIn: false
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password Regex: 8+ chars, 1 upper, 1 lower, 1 digit, 1 special
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle Strength Meter
  useEffect(() => {
    let strength = 0;
    const { password } = formData;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!PASSWORD_REGEX.test(formData.password)) {
      setError("Password does not meet security requirements.");
      return;
    }

    setLoading(true);

    try {
      // POST to your AuthRestController registration endpoint
      const response = await axios.post('http://localhost:8080/api/auth/register', formData);
      
      // On success, redirect to the OTP confirmation page
      // Pass the email in state so the next page knows which user to verify
      navigate('/confirm-otp', { 
        state: { 
          email: formData.username,
          message: response.data.message 
        } 
      });

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. This email or phone might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 3) return 'bg-red-400';
    if (passwordStrength < 5) return 'bg-amber-400';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20 font-sans">
      <div className="max-w-2xl w-full">
        
        {/* BRAND LOGO */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="bg-white p-2 rounded-2xl shadow-sm group-hover:shadow-md transition-all border border-gray-100">
              <img src="/assets/Chaknik_Logo.png" alt="Anvi Studio" className="h-12 w-auto" />
            </div>
            <span className="text-2xl font-serif font-bold italic text-gray-900">Anvi Studio</span>
          </Link>
        </div>

        {/* REGISTRATION CARD */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-orange-50 text-orange-500 rounded-3xl">
                <UserPlus size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 italic">Create Account</h1>
                <p className="text-gray-400 text-sm mt-1">Join our exclusive circle of fashion enthusiasts.</p>
              </div>
            </div>

            {error && (
              <div className="mb-8 bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                <AlertCircle size={24} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 ml-1">First Name</label>
                  <input 
                    type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 ml-1">Last Name</label>
                  <input 
                    type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all"
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input 
                      type="email" name="username" required value={formData.username} onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 ml-1">Mobile Number</label>
                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input 
                      type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password Management */}
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 ml-1">Set Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
                        className="w-full bg-white border-none rounded-2xl pl-6 pr-12 py-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
                      />
                      <button 
                        type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 ml-1">Confirm Password</label>
                    <input 
                      type={showPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                      className="w-full bg-white border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
                    />
                  </div>
                </div>

                {/* Strength Meter */}
                <div className="space-y-2 px-1">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">Security Strength</span>
                    <span className={passwordStrength === 5 ? 'text-green-600' : 'text-orange-400'}>
                      {passwordStrength < 3 ? 'Weak' : passwordStrength < 5 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full transition-all duration-500 ${getStrengthColor()}`} 
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 italic">
                    Requires 8+ chars, uppercase, lowercase, number, and a symbol.
                  </p>
                </div>
              </div>

              {/* Optional Profile Info */}
              <div className="pt-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 mb-6 flex items-center gap-3">
                  Optional Preferences
                  <div className="h-px flex-1 bg-gray-100"></div>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Preferred Size</label>
                    <select 
                      name="preferredSize" value={formData.preferredSize} onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select</option>
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Gender</label>
                    <select 
                      name="gender" value={formData.gender} onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select</option>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Birth Date</label>
                    <input 
                      type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" name="termsAccepted" id="termsAccepted" required
                    checked={formData.termsAccepted} onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-200 text-orange-500 focus:ring-orange-500 mt-0.5"
                  />
                  <label htmlFor="termsAccepted" className="text-xs text-gray-500 leading-relaxed">
                    I agree to the <Link to="/policy_terms" className="font-bold text-gray-900 hover:underline">Terms of Service</Link> and 
                    acknowledge the <Link to="/policy_privacy" className="font-bold text-gray-900 hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" name="newsletterOptIn" id="newsletterOptIn"
                    checked={formData.newsletterOptIn} onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-200 text-orange-500 focus:ring-orange-500 mt-0.5"
                  />
                  <label htmlFor="newsletterOptIn" className="text-xs text-gray-500 leading-relaxed font-medium">
                    Subscribe to the Anvi Studio newsletter for exclusive early access to new handloom collections.
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !formData.termsAccepted}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <CheckCircle2 size={20} className="text-orange-500" />
                    Register My Account
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-50 text-center">
              <p className="text-sm text-gray-400">
                Already have an account? {' '}
                <Link to="/login" className="text-orange-600 font-bold hover:text-orange-700 underline underline-offset-4">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;