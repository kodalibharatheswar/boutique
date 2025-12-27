import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Gift, 
  Plus, 
  History, 
  ArrowLeft, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Calendar,
  IndianRupee
} from 'lucide-react';

const GiftCards = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [redeemCode, setRedeemCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/customer/gift-cards', {
        withCredentials: true
      });
      setGiftCards(response.data);
    } catch (err) {
      setError("Failed to load your gift card information.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (redeemCode.trim().length < 16) {
      setError("Please enter a valid 16-digit gift card number.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Assuming an endpoint exists for redemption
      await axios.post('http://localhost:8080/api/customer/gift-cards/redeem', { code: redeemCode }, {
        withCredentials: true
      });
      setSuccess("Gift card redeemed successfully! Your balance has been updated.");
      setRedeemCode('');
      fetchGiftCards(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.error || "Invalid gift card code or already redeemed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total balance from all active cards
  const totalBalance = giftCards.reduce((acc, card) => acc + card.currentBalance, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading your rewards...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 py-12 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link to="/customer/dashboard" className="flex items-center text-orange-600 hover:text-orange-700 mb-2 font-bold transition-colors">
              <ArrowLeft size={18} className="mr-1" /> My Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Gift Cards & Vouchers</h1>
            <p className="text-gray-500 mt-2 italic">Treat yourself or a loved one to handcrafted elegance.</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-3xl text-orange-600 hidden md:block">
            <Gift size={48} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Balance & Redemption (7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Visual Balance Card */}
            <div className="bg-gradient-to-br from-[#ff7c04] to-orange-400 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-orange-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <CreditCard size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-orange-200 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-100">Store Credit Balance</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-bold italic">₹{totalBalance.toFixed(2)}</span>
                </div>
                <div className="mt-10 pt-6 border-t border-white/20">
                  <p className="text-sm font-medium text-orange-50">Anvi Studio Loyalty Rewards</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold mt-1 opacity-70">Valid for all online purchases</p>
                </div>
              </div>
            </div>

            {/* Redemption Form */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Plus size={20} className="text-orange-500" />
                Redeem New Card
              </h2>
              
              {error && (
                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 border border-green-100">
                  <CheckCircle size={20} />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Enter 16-digit card number"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl px-6 py-4 outline-none transition-all font-mono tracking-widest text-gray-800"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !redeemCode}
                  className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Redeem Now'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: History (5 Columns) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden h-full">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <History className="text-orange-500" size={20} />
                <h3 className="text-lg font-serif font-bold text-gray-900">Card History</h3>
              </div>

              <div className="p-8 space-y-6">
                {giftCards.length === 0 ? (
                  <div className="text-center py-10">
                    <CreditCard className="mx-auto text-gray-200 mb-4" size={48} />
                    <p className="text-gray-400 italic">No gift cards linked to your account yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {giftCards.map((card) => (
                      <div key={card.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs text-gray-400 tracking-wider">**** **** **** {card.cardNumber.slice(-4)}</span>
                          <span className="font-bold text-green-600">₹{card.currentBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-400">
                          <Calendar size={12} />
                          <span>Expires: {card.expirationDate ? new Date(card.expirationDate).toLocaleDateString() : 'No Expiry'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-6 border-t border-gray-50">
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    * Gift cards can be applied at the payment stage of your checkout process. They are non-refundable and cannot be exchanged for cash.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default GiftCards;