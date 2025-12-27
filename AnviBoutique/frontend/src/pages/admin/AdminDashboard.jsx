import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  Star, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock stats - in a real app, you'd fetch these from a specific dashboard API
  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: '12', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Reviews', value: '3', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Inquiries', value: '5', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/products', {
        withCredentials: true
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/products/${id}`, {
        withCredentials: true
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link 
      to={to} 
      className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors rounded-lg group"
    >
      <Icon size={20} className="group-hover:text-orange-500 transition-colors" />
      <span className="font-medium">{children}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-6">
          <h2 className="text-white text-2xl font-serif font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">A</div>
            Anvi Admin
          </h2>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <NavLink to="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
          <NavLink to="/admin/orders" icon={ShoppingBag}>Orders</NavLink>
          <NavLink to="/admin/reviews" icon={Star}>Reviews</NavLink>
          <NavLink to="/admin/contacts" icon={MessageSquare}>Messages</NavLink>
          <div className="pt-4 mt-4 border-t border-gray-800">
            <button 
              onClick={() => {/* Implement logout */}}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 w-full text-left rounded-lg"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">Welcome, Administrator</span>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* INVENTORY TABLE AREA */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-lg font-bold text-gray-900">Product Inventory</h3>
              
              <div className="flex w-full md:w-auto gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search SKU or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  />
                </div>
                <Link 
                  to="/admin/products/add" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <Plus size={18} /> Add Product
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Product Info</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <Loader2 className="animate-spin inline-block text-orange-500" size={32} />
                        <p className="text-gray-400 mt-2 text-sm">Loading inventory...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-gray-500 italic">No products found.</td>
                    </tr>
                  ) : filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={`/api/public/images/${product.imageUrl || 'placeholder.jpg'}`} 
                          alt="" 
                          className="w-12 h-16 object-cover rounded-md bg-gray-100"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
                        {product.discountPercent > 0 && (
                          <div className="text-xs text-green-600">-{product.discountPercent}% Off</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          product.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;