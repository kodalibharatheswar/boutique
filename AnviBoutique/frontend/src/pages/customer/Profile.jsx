import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Eye, 
  EyeOff,
  UserCircle
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Profile State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  // Modal Visibility
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Form States
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [emailForm, setEmailForm] = useState({ newEmail: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/customer/profile', {
        withCredentials: true
      });
      setProfile(response.data);
    } catch (err) {
      setError("Failed to load profile data. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await axios.put('http://localhost:8080/api/customer/profile', profile, {
        withCredentials: true
      });
      setSuccess("Your personal details have been updated successfully.");
    } catch (err) {
      setError("Failed to update profile. Please check your information.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/customer/profile/change-password', passwordForm, {
        withCredentials: true
      });
      setSuccess("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Securing your profile access...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/customer/dashboard" className="flex items-center text-orange-600 hover:text-orange-700 mb-4 font-bold transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-6">
            <div className="bg-orange-500 text-white w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-serif font-bold shadow-xl shadow-orange-100">
              {profile.firstName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-500 mt-1 italic">Personalize your experience at Anvi Boutique.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12 space-y-10">
        
        {/* SUCCESS/ERROR NOTIFICATIONS */}
        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-[2rem] border border-red-100 flex items-center gap-4 animate-in fade-in">
            <AlertCircle size={24} className="shrink-0" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-6 rounded-[2rem] border border-green-100 flex items-center gap-4 animate-in fade-in">
            <CheckCircle2 size={24} className="shrink-0" />
            <p className="font-medium text-sm">{success}</p>
          </div>
        )}

        {/* PERSONAL DETAILS CARD */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <User size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-gray-900">Personal Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">First Name</label>
                  <input 
                    type="text" 
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Last Name</label>
                  <input 
                    type="text" 
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 opacity-60">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Login Email</label>
                  <div className="w-full bg-gray-100 rounded-2xl px-6 py-4 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">{profile.email}</span>
                    <ShieldCheck size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SECURITY SETTINGS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PASSWORD CARD */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Password Management</h3>
              <p className="text-sm text-gray-500 leading-relaxed italic mb-8">
                Regularly updating your password ensures your boutique account remains secure.
              </p>
            </div>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Edit3 size={18} /> Update Password
            </button>
          </div>

          {/* EMAIL CARD */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Communication Email</h3>
              <p className="text-sm text-gray-500 leading-relaxed italic mb-8">
                Your email is used for order tracking and exclusive newsletter offers.
              </p>
            </div>
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Edit3 size={18} /> Change Email
            </button>
          </div>
        </div>
      </main>

      {/* PASSWORD UPDATE MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 flex justify-between items-center border-b border-gray-50">
              <h2 className="text-2xl font-serif font-bold">Secure Password Reset</h2>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleChangePassword} className="p-8 space-y-6">
              <div className="relative">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Current Password</label>
                <input 
                  type={showPass ? "text" : "password"} required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-6 py-4 mt-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <button 
                  type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 bottom-4 text-gray-400"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                <input 
                  type="password" required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input 
                  type="password" required placeholder="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all">
                Update Security Credentials
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EMAIL UPDATE MODAL */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 flex justify-between items-center border-b border-gray-50">
              <h2 className="text-2xl font-serif font-bold">Update Account Email</h2>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-orange-50 p-4 rounded-2xl flex items-start gap-3 border border-orange-100">
                <AlertCircle className="text-orange-500 shrink-0" size={20} />
                <p className="text-xs text-orange-800 font-medium leading-relaxed">
                  Changing your email requires verification. A unique link will be sent to your new address to confirm the change.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">New Email Address</label>
                <input 
                  type="email" required placeholder="example@newemail.com"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({newEmail: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <button 
                onClick={() => alert("Verification email sent!")}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all"
              >
                Send Verification Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;