import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingBag, 
  Package, 
  Calendar, 
  RotateCcw, 
  Star, 
  ArrowLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ productId: null, productName: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/customer/orders', {
        withCredentials: true
      });
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load your order history. Please ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReturn = async (orderId) => {
    if (!window.confirm("Are you sure you want to request a return for this order?")) return;
    try {
      await axios.post(`http://localhost:8080/api/customer/orders/${orderId}/return`, null, {
        withCredentials: true
      });
      alert("Return request submitted successfully.");
      fetchOrders(); // Refresh to update status badge
    } catch (err) {
      alert("Failed to process return request. Contact support if the issue persists.");
    }
  };

  const openReviewModal = (productId, productName) => {
    setReviewData({ productId, productName, rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await axios.post(`http://localhost:8080/api/products/${reviewData.productId}/review`, {
        rating: reviewData.rating,
        comment: reviewData.comment
      }, { withCredentials: true });
      
      alert("Thank you! Your review has been submitted for moderation.");
      setShowReviewModal(false);
    } catch (err) {
      alert("Error submitting review: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'RETURN_REQUESTED': return 'bg-orange-100 text-orange-700';
      case 'RETURNED': return 'bg-purple-100 text-purple-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Fetching your order history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/customer/dashboard" className="flex items-center text-orange-600 hover:text-orange-700 mb-2 font-bold transition-colors">
            <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-2 italic">Track and manage your handcrafted selections.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-10">
        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 flex items-center gap-4 mb-8">
            <AlertCircle size={24} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-20 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">No orders found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">It looks like you haven't made any purchases yet. Explore our latest collections to find something beautiful.</p>
            <Link to="/products" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Meta Header */}
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8 flex-wrap">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Order ID</p>
                      <p className="text-sm font-bold text-gray-900">#{order.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Date Placed</p>
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total Amount</p>
                      <p className="text-sm font-bold text-orange-600 font-serif italic">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </div>
                </div>

                {/* Items List */}
                <div className="p-8">
                  <div className="divide-y divide-gray-50">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <img 
                            src={`/api/public/images/${item.product.imageUrl || 'placeholder.jpg'}`} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                          <p className="text-xs text-gray-400 mt-1">Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-3">
                          {order.status === 'DELIVERED' && (
                            <button 
                              onClick={() => openReviewModal(item.product.id, item.product.name)}
                              className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 border border-orange-100"
                            >
                              <Star size={14} fill="currentColor" /> Review Product
                            </button>
                          )}
                          <Link to={`/products/${item.product.id}`} className="text-xs font-bold text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 border border-gray-100">
                            Buy Again
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="mt-8 pt-8 border-t border-gray-50 flex flex-wrap justify-end gap-4">
                    {['PENDING', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
                      <button 
                        onClick={() => handleRequestReturn(order.id)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-red-100 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-50 transition-all shadow-sm"
                      >
                        <RotateCcw size={16} /> Request Return
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
                      View Order Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Share Your Experience</h2>
              <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-8 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product</p>
                <p className="font-bold text-gray-800 text-lg">{reviewData.productName}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="p-1 transition-transform active:scale-90"
                    >
                      <Star 
                        size={32} 
                        className={star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-200'} 
                        fill={star <= reviewData.rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Review Content</label>
                <textarea 
                  required
                  rows="4"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="What did you love about this item?"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 resize-none shadow-inner"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingReview ? <Loader2 className="animate-spin" size={20} /> : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;