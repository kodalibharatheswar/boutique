import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  UserCircle,
  Calendar,
  Mail,
  Smartphone,
  Info,
  Settings
} from 'lucide-react';

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State matching customer_profile_management.html
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: 'OTHER',
    dateOfBirth: '',
    newsletterOptIn: false
  });

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      setLoading(true);
      // Fetch current data to populate the form
      const response = await axios.get('http://localhost:8080/api/customer/profile', {
        withCredentials: true
      });
      
      // Ensure date is formatted correctly for <input type="date"> (YYYY-MM-DD)
      const data = response.data;
      if (data.dateOfBirth) {
        data.dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];
      }
      
      setFormData(data);
    } catch (err) {
      setError("Unable to load profile settings. Please ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put('http://localhost:8080/api/customer/profile', formData, {
        withCredentials: true
      });
      setSuccess("Your account preferences have been saved successfully.");
      // Optional: Redirect back to the main profile view after success
      setTimeout(() => navigate('/customer/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update account settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/customer/profile" className="flex items-center text-orange-600 hover:text-orange-700 mb-4 font-bold transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Profile
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <Settings size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Manage Account Preferences</h1>
              <p className="text-gray-500 text-sm mt-1 italic">Update your identity and communication settings.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        {/* Status Banners */}
        {error && (
          <div className="mb-8 bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 flex items-center gap-4">
            <AlertCircle size={24} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-8 bg-green-50 text-green-700 p-6 rounded-3xl border border-green-100 flex items-center gap-4">
            <CheckCircle2 size={24} />
            <p className="font-medium text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identity Section */}
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                <User size={20} className="text-blue-500" />
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">First Name</label>
                  <input 
                    type="text" name="firstName" required
                    value={formData.firstName} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Last Name</label>
                  <input 
                    type="text" name="lastName" required
                    value={formData.lastName} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Gender</label>
                  <select 
                    name="gender" value={formData.gender} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other / Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1 flex items-center gap-1">
                    <Calendar size={12} /> Date of Birth
                  </label>
                  <input 
                    type="date" name="dateOfBirth"
                    value={formData.dateOfBirth} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Smartphone size={20} className="text-purple-500" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                  <input 
                    type="tel" name="phoneNumber"
                    value={formData.phoneNumber} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 opacity-60">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1 flex items-center gap-1">
                    <Mail size={12} /> Registered Email
                  </label>
                  <div className="w-full bg-gray-100 rounded-2xl px-6 py-4 text-gray-500 flex items-center justify-between">
                    <span className="font-medium">{formData.email}</span>
                    <Info size={16} title="Email cannot be changed here" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Mail size={20} className="text-orange-500" />
                Newsletter & Notifications
              </h3>
              
              <div className="flex items-start gap-4 p-6 bg-orange-50/50 rounded-3xl border border-orange-100">
                <input 
                  type="checkbox" 
                  id="newsletterOptIn"
                  name="newsletterOptIn"
                  checked={formData.newsletterOptIn}
                  onChange={handleChange}
                  className="w-6 h-6 mt-1 rounded-lg border-orange-200 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="newsletterOptIn" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  <span className="font-bold block mb-1">Join the Anvi Studio Circle</span>
                  Subscribe to our newsletter for exclusive previews of new handloom collections, styling tips, and festive discount codes.
                </label>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 italic">
                <CheckCircle2 size={12} className="text-green-500" />
                Terms of Service and Privacy Policy accepted upon registration.
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate('/customer/profile')}
              className="px-10 py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save All Changes</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfileManagement;