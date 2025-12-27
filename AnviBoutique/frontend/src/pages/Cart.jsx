import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ChevronRight, 
  Loader2, 
  MapPin 
} from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/cart', {
        withCredentials: true
      });
      setCart(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (err.response?.status === 401) {
        // Redirect to a specialized unauth cart page or login
        navigate('/login?redirect=cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingId(itemId);
      await axios.put(`http://localhost:8080/api/cart/items/${itemId}`, null, {
        params: { quantity: newQuantity },
        withCredentials: true
      });
      fetchCart(); // Refresh data to get new totals
    } catch (err) {
      alert("Failed to update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Remove this item from your cart?")) return;
    try {
      setUpdatingId(itemId);
      await axios.delete(`http://localhost:8080/api/cart/items/${itemId}`, {
        withCredentials: true
      });
      fetchCart();
    } catch (err) {
      alert("Failed to remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading your selection...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">My Shopping Cart</h1>
              <p className="text-gray-500 text-sm">{cart.items.length} Items Selected</p>
            </div>
          </div>
          <Link to="/products" className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-2 transition-colors">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-10">
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-300" size={48} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Your cart is feeling a bit light!</h2>
            <p className="text-gray-500 mb-8">Add some of our beautiful handcrafted sarees to get started.</p>
            <Link 
              to="/products" 
              className="inline-block bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all hover:-translate-y-1"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* ITEM LIST (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              {cart.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 transition-opacity ${updatingId === item.id ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                >
                  {/* Product Image */}
                  <div className="w-full md:w-32 h-40 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src={`/api/public/images/${item.product.imageUrl || 'placeholder.jpg'}`} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info & Quantity */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.product.name}</h3>
                          <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">{item.product.category}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">Unit: ₹{item.product.price.toFixed(2)}</p>
                        <p className="text-xl font-bold text-orange-600">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY (4 Columns) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-10">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 border-b border-gray-100 pb-6">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                  </div>
                </div>

                <div className="pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-bold">Total Amount</span>
                    <span className="text-3xl font-serif font-bold text-orange-600">₹{cart.total.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 italic text-right">Inclusive of all taxes</p>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 group"
                >
                  <MapPin size={20} className="text-orange-500" />
                  Proceed to Delivery
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-40">
                  {/* Small logos or text representing safe checkout */}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure Payments via Stripe</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;