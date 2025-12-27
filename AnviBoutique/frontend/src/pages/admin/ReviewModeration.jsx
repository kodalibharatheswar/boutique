import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Star, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  User, 
  Package,
  Loader2,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUnapprovedReviews();
  }, []);

  const fetchUnapprovedReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/reviews/unapproved', {
        withCredentials: true
      });
      setReviews(response.data);
    } catch (err) {
      setError("Failed to load reviews. Ensure you have administrator privileges.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/reviews/${id}/approve`, null, {
        withCredentials: true
      });
      // Remove approved review from the local pending list
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      alert("Error approving review.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this review?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/reviews/${id}`, {
        withCredentials: true
      });
      // Remove rejected review from the local pending list
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      alert("Error deleting review.");
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            fill={i < rating ? "currentColor" : "none"} 
            className={i < rating ? "text-yellow-400" : "text-gray-200"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header Section */}
      <header className="bg-[#222] text-white py-12 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <Link to="/admin" className="flex items-center text-orange-400 hover:text-orange-300 mb-4 transition-colors">
            <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold italic text-orange-50">Review Moderation</h1>
              <p className="text-gray-400 mt-2">Manage customer feedback for Anvi Boutique products.</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl backdrop-blur-sm">
              <span className="text-orange-400 font-bold text-2xl">{reviews.length}</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 ml-2">Pending Approval</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="text-lg">Fetching unapproved feedback...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Queue is Empty</h2>
            <p className="text-gray-500 max-w-sm mx-auto">Great work! All customer reviews have been moderated.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Review Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-none">{review.user.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-400 flex items-center">
                              <Calendar size={12} className="mr-1" /> {new Date(review.reviewDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
                        <Package className="text-orange-500 shrink-0 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Product Reference</p>
                          <p className="text-gray-800 font-medium">#{review.product.id} - {review.product.name}</p>
                        </div>
                      </div>

                      <div className="relative pt-4">
                        <MessageSquare className="absolute -top-1 -left-2 text-gray-100" size={40} />
                        <p className="relative z-10 text-gray-700 leading-relaxed italic px-4">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-100 hover:-translate-y-0.5 active:scale-95"
                      >
                        <CheckCircle size={18} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-100 text-red-600 rounded-2xl hover:bg-red-50 transition-all font-bold hover:border-red-200 active:scale-95"
                      >
                        <Trash2 size={18} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewModeration;