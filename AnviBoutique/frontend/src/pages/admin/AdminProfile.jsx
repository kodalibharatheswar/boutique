import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Lock, 
  Phone, 
  ShieldAlert, 
  Save, 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [adminStatus, setAdminStatus] = useState({
    username: '',
    needsCredentialUpdate: false
  });

  const [formData, setFormData] = useState({
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
    recoveryPhoneNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  // Regex: 8+ chars, 1 upper, 1 lower, 1 digit, 1 special
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  const fetchAdminStatus = async () => {
    try {
      setStatusLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/status', {
        withCredentials: true
      });
      setAdminStatus(response.data);
      setFormData(prev => ({ ...prev, newUsername: response.data.username }));
    } catch (err) {
      setError("Failed to verify admin session.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.newUsername) return "Username is required.";
    if (formData.newPassword) {
      if (!PASSWORD_REGEX.test(formData.newPassword)) {
        return "Password must be 8+ characters and include uppercase, lowercase, number, and special character.";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        return "Passwords do not match.";
      }
    }
    if (formData.recoveryPhoneNumber && !/^\d{10}$/.test(formData.recoveryPhoneNumber)) {
      return "Recovery phone must be exactly 10 digits.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put('http://localhost:8080/api/admin/profile', formData, {
        withCredentials: true
      });
      setSuccess(response.data.message);
      // If credentials changed, user will likely be logged out by Spring Security
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header Section */}
      <header className="bg-gray-900 text-white py-12 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldAlert size={120} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/admin" className="flex items-center text-orange-400 hover:text-orange-300 mb-4 transition-colors">
            <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-serif font-bold">Admin Security Profile</h1>
          <p className="text-gray-400 mt-2 italic text-lg">Manage your access credentials and recovery options.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 gap-8">
          
          {/* SECURITY ALERT BANNER */}
          {adminStatus.needsCredentialUpdate && (
            <div className="bg-orange-600 text-white p-6 rounded-xl shadow-xl flex items-start gap-4 animate-pulse">
              <AlertTriangle size={32} className="shrink-0" />
              <div>
                <h3 className="font-bold text-lg">SECURITY ALERT: Default Credentials Detected</h3>
                <p className="text-orange-100 text-sm">
                  You are currently logged in with the default 'admin' account. For the safety of Anvi Boutique, please update your username and password immediately.
                </p>
              </div>
            </div>
          )}

          {/* MAIN FORM CARD */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3">
                    <AlertTriangle className="text-red-500" size={20} />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <p className="text-green-700 font-medium">{success}</p>
                  </div>
                )}

                {/* Identity Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
                    <User className="text-orange-500" size={20} /> Account Identity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Admin Username</label>
                      <input
                        type="text"
                        name="newUsername"
                        value={formData.newUsername}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="e.g. anvi_manager"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Recovery Phone (10 Digits)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="recoveryPhoneNumber"
                          value={formData.recoveryPhoneNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Security Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
                    <Lock className="text-orange-500" size={20} /> Security Update
                  </h3>
                  <p className="text-xs text-gray-500 italic">Leave password fields blank if you do not wish to change your current password.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || statusLoading}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-orange-200 disabled:opacity-50 transition-all transform hover:-translate-y-1 active:scale-95"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <><Save size={20} /> Update Security Settings</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;