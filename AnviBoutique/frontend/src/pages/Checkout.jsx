import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CreditCard, 
  HandCoins, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Wallet,
  Smartphone,
  Lock
} from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('CARD');
  const [data, setData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Stripe state
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const cardRef = useRef(null);

  const selectedAddressId = location.state?.addressId;

  // 1. Fetch Checkout Data
  useEffect(() => {
    if (!selectedAddressId) {
      navigate('/customer/addresses');
      return;
    }
    fetchCheckoutData();
  }, [selectedAddressId]);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/payment/checkout-data', {
        withCredentials: true
      });
      setData(response.data);
      loadStripeScript(response.data.publishableKey, response.data.stripeClientSecret);
    } catch (err) {
      console.error("Checkout init error:", err);
      setErrorMessage("Failed to initialize checkout. Please check your cart.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Load Stripe CDN Script
  const loadStripeScript = (publishableKey, clientSecret) => {
    if (!publishableKey) return;
    
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      const stripeInstance = window.Stripe(publishableKey);
      setStripe(stripeInstance);
      
      const elementsInstance = stripeInstance.elements();
      const card = elementsInstance.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
        }
      });
      
      setElements(elementsInstance);
      setCardElement(card);
    };
    document.body.appendChild(script);
  };

  // 3. Mount Card Element when Tab changes
  useEffect(() => {
    if (activeTab === 'CARD' && cardElement && cardRef.current) {
      cardElement.mount(cardRef.current);
    }
  }, [activeTab, cardElement]);

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !cardElement) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmCardPayment(data.stripeClientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      finalizeOrder('CARD', paymentIntent.id);
    }
  };

  const handleCodSubmit = async () => {
    finalizeOrder('COD');
  };

  const finalizeOrder = async (mode, intentId = null) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8080/api/payment/finalize', {
        addressId: selectedAddressId,
        paymentMode: mode,
        stripeIntentId: intentId
      }, { withCredentials: true });
      navigate('/payment/success');
    } catch (err) {
      setErrorMessage("Failed to record your order. Please contact support.");
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  const shippingAddress = data?.addresses?.find(a => a.id === selectedAddressId) || data?.addresses?.[0];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <header className="bg-white border-b border-gray-200 py-8 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              <Link to="/cart" className="hover:text-orange-500">Cart</Link>
              <ChevronRight size={12} />
              <Link to="/customer/addresses" className="hover:text-orange-500">Address</Link>
              <ChevronRight size={12} />
              <span className="text-orange-500">Payment</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 italic">Checkout</h1>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
            <ShieldCheck className="text-green-600" size={20} />
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-white min-h-[500px]">
              
              {/* Tabs Sidebar */}
              <div className="md:w-64 bg-slate-50 border-r border-gray-100 p-4 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4 mb-4">Select Method</p>
                
                <button 
                  onClick={() => setActiveTab('CARD')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'CARD' ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-100' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <CreditCard size={18} /> Card Payment
                </button>

                <button 
                  onClick={() => setActiveTab('COD')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'COD' ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-100' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <HandCoins size={18} /> Cash on Delivery
                </button>

                <div className="opacity-40 cursor-not-allowed">
                  <button disabled className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm text-gray-400">
                    <Smartphone size={18} /> UPI (Soon)
                  </button>
                  <button disabled className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm text-gray-400">
                    <Wallet size={18} /> Wallets (Soon)
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-8 md:p-12">
                <div className="mb-10 p-6 bg-orange-50/50 rounded-3xl border border-orange-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-orange-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Shipping Info</span>
                    </div>
                    <p className="font-bold text-gray-900">{shippingAddress?.fullName}</p>
                    <p className="text-sm text-gray-500">{shippingAddress?.addressLine1}, {shippingAddress?.city}</p>
                  </div>
                  <Link to="/customer/addresses" className="text-xs font-bold text-orange-500 hover:underline">Change</Link>
                </div>

                {activeTab === 'CARD' ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 italic">Secure Card Payment</h3>
                    <p className="text-gray-400 text-sm mb-8">We accept all major international cards.</p>
                    
                    <form onSubmit={handleCardSubmit} className="space-y-6">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <div ref={cardRef} className="p-2"></div>
                      </div>

                      {errorMessage && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
                          <AlertCircle size={16} /> {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isProcessing || !stripe}
                        className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><Lock size={18}/> Pay ₹{data?.totalPrice?.toFixed(2)}</>}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 italic">Cash on Delivery</h3>
                    <p className="text-gray-400 text-sm mb-8">Simple and easy. Pay at your doorstep.</p>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
                        <CheckCircle2 className="text-blue-600 shrink-0" size={24} />
                        <p className="text-sm text-blue-800 leading-relaxed font-medium">
                          No extra convenience fees for COD. Simply pay the total amount during delivery.
                        </p>
                      </div>

                      <button 
                        onClick={handleCodSubmit}
                        className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                      >
                        Confirm Order (₹{data?.totalPrice?.toFixed(2)})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-10">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 italic">Order Summary</h2>
              
              <div className="space-y-4 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Cart Items ({data?.cartItems?.length || 0})</span>
                  <span className="font-bold text-gray-900">₹{data?.totalPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold uppercase tracking-widest text-[10px]">Total Amount</span>
                  <span className="text-3xl font-serif font-bold text-orange-600">₹{data?.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Checkout;