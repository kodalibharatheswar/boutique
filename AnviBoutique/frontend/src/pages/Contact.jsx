import React, { useState } from 'react';
import axios from 'axios';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Endpoint created in HomeRestController
      const response = await axios.post('http://localhost:8080/api/public/contact', formData);
      
      setStatus({ type: 'success', message: response.data.message });
      setFormData({ fullName: '', email: '', phoneNumber: '', message: '' }); // Reset form
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || "Something went wrong. Please try again later." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* HERO SECTION */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <MessageCircle size={150} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 italic">Get in Touch</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Have a question about our collections or need a customized outfit? We'd love to hear from you.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* CONTACT INFORMATION */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                Store Information
                <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 h-fit">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Our Studio</h4>
                    <p className="text-gray-500 text-sm leading-relaxed italic">
                      Vijayawada,<br />Andhra Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 h-fit">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      +91 94903 34557
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 h-fit">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email Support</h4>
                    <p className="text-gray-500 text-sm leading-relaxed break-all">
                      anvistudio6@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 h-fit">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Mon - Sat: 10:00 AM - 8:00 PM<br />
                      Sun: Appointment Only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAP IFRAME */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 grayscale hover:grayscale-0 transition-all duration-700 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.2388373303657!2d80.6482618!3d16.5126839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a06d0b3074099%3A0x69666061327137f8!2sVijayawada%2C%20Andhra%20Pradesh%2C%20India!5e0!3m2!1sen!2sin!v1626262626262!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Store Location"
              ></iframe>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-50 overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Send a Message</h2>
              <p className="text-gray-500 text-sm mb-10 italic">Your email address will not be published.</p>

              {status.message && (
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${
                  status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-medium">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input 
                      type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-gray-800"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-gray-800"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number (Optional)</label>
                  <input 
                    type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-gray-800"
                    placeholder="+91 00000 00000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                  <textarea 
                    name="message" required rows="4" value={formData.message} onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-gray-800 resize-none"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Contact;