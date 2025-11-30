'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Plus, X, Save, Upload } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();

  // Improved Auth Check
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('userRole');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token || userRole !== 'admin' || !isAdmin) {
      router.push('/login');
      return;
    }
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:3001/products');
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    router.push('/login');
  };

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
    // Don't set Content-Type for FormData (upload) as browser sets boundary
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, { ...options, headers });
    
    if (res.status === 401) {
      handleLogout();
      throw new Error('Unauthorized');
    }
    
    return res;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');

    try {
      // Use standard fetch for upload to avoid manual Content-Type header issues with FormData
      const res = await fetch('http://127.0.0.1:3001/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (res.status === 401) {
        handleLogout();
        return;
      }
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setCurrentProduct(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      alert('Failed to upload image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await authFetch(`http://127.0.0.1:3001/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = currentProduct.id ? 'PUT' : 'POST';
    const url = currentProduct.id 
      ? `http://127.0.0.1:3001/products/${currentProduct.id}` 
      : 'http://127.0.0.1:3001/products';

    const payload = {
        ...currentProduct,
        price: Number(currentProduct.price),
        quantity: Number(currentProduct.quantity),
        rating: Number(currentProduct.rating || 5)
    };

    try {
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      const savedProduct = await res.json();
      
      if (currentProduct.id) {
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      } else {
        setProducts([...products, savedProduct]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save product');
      console.error(err);
    }
  };

  const openAddModal = () => {
    setCurrentProduct({
      name: { en: '', vi: '' },
      description: { en: '', vi: '' },
      category: { en: 'Acrylic', vi: 'Acrylic' },
      price: 0,
      quantity: 0,
      image: '/placeholder.jpg',
      rating: 5
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(JSON.parse(JSON.stringify(product)));
    setIsModalOpen(true);
  };

  const categories = [
    { en: 'Acrylic', vi: 'Acrylic' },
    { en: 'Dipping Powder', vi: 'Bột Nhúng' },
    { en: 'Manicure', vi: 'Làm Móng Tay' },
    { en: 'Gel Polish', vi: 'Sơn Gel' },
    { en: 'Gel & Top Coat', vi: 'Gel & Lớp Phủ' },
    { en: 'Nail Tips & Glue', vi: 'Móng Giả & Keo' },
    { en: 'Treatments', vi: 'Điều Trị' },
    { en: 'Tools & Accessories', vi: 'Dụng Cụ & Phụ Kiện' },
    { en: 'Waxing', vi: 'Tẩy Lông' },
    { en: 'Pedicure', vi: 'Chăm Sóc Móng Chân' },
    { en: 'Eyelashes', vi: 'Lông Mi' },
    { en: 'Gloves', vi: 'Găng Tay' }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-vintage-dark">Product Management</h1>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-vintage-border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN/VI)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name?.en || product.name}</div>
                    <div className="text-xs text-gray-500">{product.name?.vi}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.en || product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => openEditModal(product)}
                        className="text-vintage-gold hover:text-vintage-gold-hover mr-4 transition-colors cursor-pointer"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 transition-colors cursor-pointer">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-serif font-bold text-vintage-dark">
                {currentProduct.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.name?.en || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: {...currentProduct.name, en: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (Vietnamese)</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.name?.vi || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: {...currentProduct.name, vi: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={currentProduct.category?.en || 'Acrylic'}
                  onChange={(e) => {
                    const selectedCat = categories.find(c => c.en === e.target.value);
                    setCurrentProduct({
                        ...currentProduct, 
                        category: { en: selectedCat.en, vi: selectedCat.vi }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.en} value={cat.en}>{cat.en} / {cat.vi}</option>
                  ))}
                </select>
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentProduct.quantity}
                    onChange={(e) => setCurrentProduct({...currentProduct, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                  <textarea
                    rows="3"
                    value={currentProduct.description?.en || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, description: {...currentProduct.description, en: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Vietnamese)</label>
                  <textarea
                    rows="3"
                    value={currentProduct.description?.vi || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, description: {...currentProduct.description, vi: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 border border-gray-300 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                        {currentProduct.image ? (
                            <img src={currentProduct.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-400">No Img</span>
                        )}
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-white border border-vintage-border text-vintage-dark px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                {uploading ? 'Uploading...' : 'Upload Image'}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                            <span className="text-xs text-gray-500">or enter URL below</span>
                        </div>
                        <input
                            type="text"
                            value={currentProduct.image || ''}
                            onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-sm"
                            placeholder="https://..."
                        />
                    </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center gap-2" disabled={uploading}>
                  <Save className="w-4 h-4" /> Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
