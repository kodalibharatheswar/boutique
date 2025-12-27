import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Calendar, Trash2, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Ensure credentials (cookies/session) are sent
      const response = await axios.get('http://localhost:8080/api/admin/contacts', {
        withCredentials: true
      });
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load messages. Ensure you are logged in as an Admin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHandled = async (id) => {
    if (!window.confirm('Mark this message as handled and delete?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/contacts/${id}`, {
        withCredentials: true
      });
      // Update local state to remove the deleted message
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (err) {
      alert('Error marking message as handled.');
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Header Area */}
      <header className="bg-[#222] text-white py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Link to="/admin" className="flex items-center text-orange-400 hover:text-orange-300 mb-2 transition-colors">
              <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-serif font-bold">Customer Inquiry Messages</h1>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
            <p className="text-sm">Total Unhandled: <span className="font-bold text-orange-400">{messages.length}</span></p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="text-lg">Fetching latest inquiries...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-orange-500" size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">All Clear!</h2>
            <p className="text-gray-500">There are no new customer messages to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className="bg-white rounded-xl shadow-sm border-l-4 border-orange-500 overflow-hidden hover:shadow-md transition-shadow duration-200 border-t border-r border-b border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <Mail className="text-gray-400 mr-2" size={20} />
                        {msg.fullName} 
                        <span className="ml-2 text-sm font-normal text-gray-500">({msg.email})</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
                        {msg.phoneNumber && (
                          <div className="flex items-center">
                            <Phone size={14} className="mr-1" /> {msg.phoneNumber}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" /> {formatDate(msg.dateSubmitted)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleMarkHandled(msg.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors self-start whitespace-nowrap text-sm font-medium"
                    >
                      <CheckCircle size={16} /> Mark as Handled
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                    <div className="absolute -top-3 left-4 bg-gray-50 px-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                      Message Content
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap italic">
                      "{msg.message}"
                    </p>
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

export default ContactMessages;