import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Package, Image as ImageIcon, IndianRupee, Tag, Layers } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams(); // Get ID from URL if editing
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Sarees',
    price: '',
    discountPercent: 0,
    sku: '',
    stockQuantity: '',
    sizeOptions: '',
    productColor: '',
    productTags: '',
    description: '',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categories = [
    "Sarees", "Lehengas", "Kurtis", "Long Frocks", "Mom & Me", "Crop Top – Skirts",
    "Handlooms", "Casual Frocks", "Ready To Wear", "Dupattas", "Kids wear",
    "Dress Material", "Blouses", "Fabrics"
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // Using the ProductRestController endpoint we built earlier
      const response = await axios.get(`http://localhost:8080/api/products/${id}`);
      const p = response.data.product;
      setFormData({
        name: p.name || '',
        category: p.category || 'Sarees',
        price: p.price || '',
        discountPercent: p.discountPercent || 0,
        sku: p.sku || '',
        stockQuantity: p.stockQuantity || '',
        sizeOptions: p.sizeOptions || '',
        productColor: p.productColor || '',
        productTags: p.productTags || '',
        description: p.description || '',
        imageUrl: p.imageUrl || ''
      });
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEditMode 
        ? `http://localhost:8080/api/admin/products/${id}` 
        : `http://localhost:8080/api/admin/products`;
      
      const method = isEditMode ? 'put' : 'post';

      await axios[method](url, formData, { withCredentials: true });
      
      setSuccess(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error saving product. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-gray-900 text-white py-8 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/admin" className="flex items-center text-orange-400 hover:text-orange-300 mb-2 transition-colors">
              <ArrowLeft size={18} className="mr-1" /> Back to Inventory
            </Link>
            <h1 className="text-3xl font-serif font-bold">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
          <Package size={40} className="text-gray-700" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 lg:p-10 space-y-8">
            
            {/* Status Messages */}
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg border-l-4 border-red-500">{error}</div>}
            {success && <div className="bg-green-50 text-green-700 p-4 rounded-lg border-l-4 border-green-500">{success}</div>}

            {/* General Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="e.g. Traditional Kanchipuram Silk Saree"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select 
                  name="category" value={formData.category} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SKU Code</label>
                <input
                  type="text" name="sku" required value={formData.sku} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="ANVI-SK-001"
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <IndianRupee size={14} className="mr-1" /> Base Price
                </label>
                <input
                  type="number" name="price" required value={formData.price} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Discount %</label>
                <input
                  type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number" name="stockQuantity" required value={formData.stockQuantity} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Product Specifics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <Layers size={14} className="mr-1" /> Size Options
                </label>
                <input
                  type="text" name="sizeOptions" value={formData.sizeOptions} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Small, Medium, Large"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Primary Color</label>
                <input
                  type="text" name="productColor" value={formData.productColor} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Maroon & Gold"
                />
              </div>
            </div>

            {/* Media & SEO */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <ImageIcon size={14} className="mr-1" /> Image Filename / URL
                </label>
                <input
                  type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="saree-01.jpg"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <Tag size={14} className="mr-1" /> Search Tags (SEO)
                </label>
                <input
                  type="text" name="productTags" value={formData.productTags} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Silk, Traditional, Wedding, Festive"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Description</label>
                <textarea
                  name="description" rows="4" value={formData.description} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4 border-t border-gray-100">
            <button
              type="button" onClick={() => navigate('/admin')}
              className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-50 transition-all"
            >
              {loading ? 'Processing...' : <><Save size={18} /> {isEditMode ? 'Save Changes' : 'Add Product'}</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProduct;