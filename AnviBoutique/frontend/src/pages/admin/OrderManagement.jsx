import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Search, 
  Calendar, 
  User, 
  Truck, 
  CheckCircle, 
  RotateCcw,
  MoreVertical,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const possibleStatuses = [
    'PENDING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED', 'CANCELLED'
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/orders', {
        withCredentials: true
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/orders/${orderId}/status`, null, {
        params: { newStatus },
        withCredentials: true
      });
      // Refresh local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleFinalizeReturn = async (orderId) => {
    if (!window.confirm('Approve return and initiate refund process?')) return;
    try {
      await axios.post(`http://localhost:8080/api/admin/orders/${orderId}/finalize-return`, null, {
        withCredentials: true
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'RETURNED' } : o));
    } catch (err) {
      alert('Failed to finalize return.');
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

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toString().includes(searchQuery);
    const matchesFilter = filterStatus === 'ALL' || o.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-[#222] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link to="/admin" className="flex items-center text-orange-400 hover:text-orange-300 mb-2 transition-colors">
              <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Order Management</h1>
            <p className="text-gray-400 mt-2">Oversee logistics and handle customer returns.</p>
          </div>
          <ShoppingBag size={64} className="text-white/10 hidden md:block" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Email..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select 
              className="px-4 py-3 rounded-lg border border-gray-200 outline-none bg-white font-medium"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {possibleStatuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <button 
              onClick={fetchOrders}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Order ID</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Customer</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Date</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Total</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <Loader2 className="animate-spin inline-block text-orange-500 mb-2" size={32} />
                      <p className="text-gray-400">Loading orders...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-gray-400 italic">No orders found.</td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.user.username}</span>
                        <span className="text-xs text-gray-400">Mode: {order.paymentMode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status Updater Dropdown */}
                        <div className="relative group">
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                            <MoreVertical size={18} />
                          </button>
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 hidden group-hover:block overflow-hidden">
                            {possibleStatuses.map(status => (
                              <button
                                key={status}
                                onClick={() => updateStatus(order.id, status)}
                                className="w-full text-left px-4 py-2 text-xs hover:bg-orange-50 hover:text-orange-600 transition-colors"
                              >
                                Set to {status.replace(/_/g, ' ')}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Finalize Return Button */}
                        {order.status === 'RETURN_REQUESTED' && (
                          <button 
                            onClick={() => handleFinalizeReturn(order.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-transform hover:scale-110 shadow-sm"
                            title="Finalize Return & Refund"
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderManagement;