import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Home, 
  Briefcase, 
  ArrowLeft,
  Loader2,
  ChevronRight,
  AlertCircle,
  X
} from 'lucide-react';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const navigate = useNavigate();

  // Initial Form State
  const initialFormState = {
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    addressType: 'HOME',
    isDefault: false
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/customer/addresses', {
        withCredentials: true
      });
      setAddresses(response.data);
      // Set default selected address
      const defaultAddr = response.data.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch (err) {
      setError("Failed to load your addresses. Please log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/customer/addresses/${id}`, {
        withCredentials: true
      });
      setAddresses(addresses.filter(a => a.id !== id));
      setSuccess("Address deleted successfully.");
    } catch (err) {
      setError("Failed to delete address.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/customer/addresses', formData, {
        withCredentials: true
      });
      setSuccess(`Address ${editingAddress ? 'updated' : 'added'} successfully.`);
      setIsModalOpen(false);
      fetchAddresses(); // Refresh list
    } catch (err) {
      setError("Error saving address. Please check your inputs.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500">Retrieving your saved addresses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link to="/customer/dashboard" className="flex items-center text-orange-600 hover:text-orange-700 mb-2 font-bold transition-colors">
              <ArrowLeft size={18} className="mr-1" /> My Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Saved Delivery Addresses</h1>
            <p className="text-gray-500 mt-2 italic">Manage your locations for faster checkout.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-100 transition-all transform hover:-translate-y-1"
          >
            <Plus size={20} /> Add New Address
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12">
        {/* Status Messages */}
        {error && <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-center gap-3"><AlertCircle size={20}/>{error}</div>}
        {success && <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex items-center gap-3"><CheckCircle size={20}/>{success}</div>}

        {addresses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <MapPin size={48} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">No addresses saved yet</h2>
            <p className="text-gray-500 mb-8">Tell us where to deliver your beautiful outfits!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {addresses.map((addr) => (
              <div 
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`relative bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer group shadow-sm hover:shadow-md ${
                  selectedAddressId === addr.id ? 'border-orange-500' : 'border-transparent'
                }`}
              >
                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 transition-opacity ${selectedAddressId === addr.id ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckCircle className="text-orange-500" fill="currentColor" fillOpacity={0.1} />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                    {addr.addressType === 'WORK' ? <Briefcase size={18} /> : <Home size={18} />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{addr.addressType}</span>
                  {addr.isDefault && (
                    <span className="bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Default</span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 mb-1">{addr.fullName}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `} <br />
                  {addr.city}, {addr.state} - {addr.zipCode}
                </p>
                <p className="text-sm text-gray-900 font-medium mt-4 flex items-center gap-2">
                  <span className="text-gray-400 text-xs font-normal">Phone:</span> {addr.phoneNumber}
                </p>

                {/* Actions */}
                <div className="mt-8 pt-4 border-t border-gray-50 flex gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenModal(addr); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Checkout Helper (Visible only if selection logic is needed) */}
        {addresses.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => navigate('/checkout', { state: { addressId: selectedAddressId } })}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 group"
            >
              Continue to Payment
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </main>

      {/* ADDRESS FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                {editingAddress ? 'Update Address' : 'New Delivery Location'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" required value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Mobile Number</label>
                  <input 
                    type="tel" required value={formData.phoneNumber} 
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Address Line 1</label>
                <input 
                  type="text" required value={formData.addressLine1} 
                  onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="House No, Building Name, Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">City</label>
                  <input 
                    type="text" required value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Pincode</label>
                  <input 
                    type="text" required value={formData.zipCode} 
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center pt-4">
                <span className="text-sm font-bold text-gray-700">Address Type:</span>
                {['HOME', 'WORK', 'OTHER'].map(type => (
                  <button
                    key={type} type="button"
                    onClick={() => setFormData({...formData, addressType: type})}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      formData.addressType === type ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" id="isDefault" 
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
                />
                <label htmlFor="isDefault" className="text-sm text-gray-600 font-medium cursor-pointer">Set as default address</label>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-orange-500 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;