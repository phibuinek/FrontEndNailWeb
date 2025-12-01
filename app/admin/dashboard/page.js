'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Plus, X, Save, Upload, ChevronLeft, ChevronRight, Package, ShoppingBag } from 'lucide-react';
import { 
    fetchProductsRequest, addProductRequest, updateProductRequest, deleteProductRequest 
} from '@/store/slices/productsSlice';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    title: "Admin Dashboard",
    tabs: {
        products: "Products",
        orders: "Orders"
    },
    addProduct: "Add Product",
    editProduct: "Edit Product",
    addNewProduct: "Add New Product",
    table: {
      id: "ID",
      name: "Name (EN/VI)",
      category: "Category",
      price: "Price",
      qty: "Qty",
      actions: "Actions"
    },
    orderTable: {
        id: "Order ID",
        date: "Date",
        customer: "Customer",
        items: "Items",
        total: "Total",
        payment: "Payment",
        status: "Status"
    },
    form: {
      nameEn: "Name (English)",
      nameVi: "Name (Vietnamese)",
      category: "Category",
      price: "Price ($)",
      qty: "Quantity",
      descEn: "Description (English)",
      descVi: "Description (Vietnamese)",
      image: "Product Image",
      upload: "Upload Image",
      uploading: "Uploading...",
      orUrl: "or enter URL below",
      save: "Save Product",
      cancel: "Cancel"
    },
    pagination: {
      page: "Page"
    }
  },
  VI: {
    title: "Trang Quản Trị",
    tabs: {
        products: "Sản Phẩm",
        orders: "Đơn Hàng"
    },
    addProduct: "Thêm Sản Phẩm",
    editProduct: "Sửa Sản Phẩm",
    addNewProduct: "Thêm Sản Phẩm Mới",
    table: {
      id: "ID",
      name: "Tên (EN/VI)",
      category: "Danh Mục",
      price: "Giá",
      qty: "SL",
      actions: "Thao Tác"
    },
    orderTable: {
        id: "Mã Đơn",
        date: "Ngày",
        customer: "Khách Hàng",
        items: "Sản Phẩm",
        total: "Tổng Tiền",
        payment: "Thanh Toán",
        status: "Trạng Thái"
    },
    form: {
      nameEn: "Tên (Tiếng Anh)",
      nameVi: "Tên (Tiếng Việt)",
      category: "Danh Mục",
      price: "Giá ($)",
      qty: "Số Lượng",
      descEn: "Mô Tả (Tiếng Anh)",
      descVi: "Mô Tả (Tiếng Việt)",
      image: "Hình Ảnh Sản Phẩm",
      upload: "Tải Ảnh Lên",
      uploading: "Đang Tải...",
      orUrl: "hoặc nhập URL bên dưới",
      save: "Lưu Sản Phẩm",
      cancel: "Hủy"
    },
    pagination: {
      page: "Trang"
    }
  }
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector((state) => state.products);
  const { language } = useLanguage();
  const t = translations[language];
  
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const router = useRouter();

  // Improved Auth Check
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('userRole');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userRole !== 'admin' || !isAdmin) {
      router.push('/');
      return;
    }
    
    // Initial fetch based on tab
    if (activeTab === 'products') {
        dispatch(fetchProductsRequest());
    } else {
        fetchOrders();
    }
  }, [dispatch, router, activeTab]);

  const fetchOrders = async () => {
      setOrdersLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendnailweb.onrender.com';
      try {
          const token = localStorage.getItem('access_token');
          const res = await fetch(`${API_URL}/orders`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          if (res.ok) {
              const data = await res.json();
              setOrders(data);
          }
      } catch (error) {
          console.error("Failed to fetch orders", error);
      } finally {
          setOrdersLoading(false);
      }
  };

  // Image upload remains local for simplicity
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendnailweb.onrender.com';

    try {
      const res = await fetch(`${API_URL}/products/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (res.status === 401) {
        localStorage.removeItem('access_token'); // Handle logout
        router.push('/login');
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

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    dispatch(deleteProductRequest(id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const payload = {
        ...currentProduct,
        price: Number(currentProduct.price),
        quantity: Number(currentProduct.quantity),
        rating: Number(currentProduct.rating || 5)
    };

    if (currentProduct.id) {
        dispatch(updateProductRequest(payload));
    } else {
        dispatch(addProductRequest(payload));
    }
    setIsModalOpen(false);
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

  // Pagination Logic
  const currentItems = activeTab === 'products' ? products : orders;
  const loading = activeTab === 'products' ? productsLoading : ordersLoading;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = currentItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && currentItems.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-vintage-dark">{t.title}</h1>
          {activeTab === 'products' && (
            <Button onClick={openAddModal} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t.addProduct}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
                onClick={() => { setActiveTab('products'); setCurrentPage(1); }}
                className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors ${
                    activeTab === 'products' 
                    ? 'border-b-2 border-vintage-gold text-vintage-gold' 
                    : 'text-gray-500 hover:text-vintage-dark'
                }`}
            >
                <Package className="w-5 h-5" />
                {t.tabs.products}
            </button>
            <button
                onClick={() => { setActiveTab('orders'); setCurrentPage(1); }}
                className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors ${
                    activeTab === 'orders' 
                    ? 'border-b-2 border-vintage-gold text-vintage-gold' 
                    : 'text-gray-500 hover:text-vintage-dark'
                }`}
            >
                <ShoppingBag className="w-5 h-5" />
                {t.tabs.orders}
            </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-vintage-border overflow-x-auto">
          {activeTab === 'products' ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.id}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.name}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.category}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.price}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.qty}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map((product) => (
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
          ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.orderTable.id}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.orderTable.date}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.orderTable.customer}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.orderTable.items}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.orderTable.total}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.orderTable.payment}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.orderTable.status}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={order._id}>...{order._id.slice(-6)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.username || 'Guest'}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} items
                        <div className="text-xs text-gray-400 truncate max-w-[150px]">
                            {order.items.map(i => i.name).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${(order.totalAmount / 100).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{order.paymentMethod === 'credit_card' ? 'Stripe' : order.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'paid' || order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paginatedItems.length === 0 && (
                      <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No orders found</td>
                      </tr>
                  )}
                </tbody>
              </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
             <button 
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-full border border-vintage-border ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-vintage-dark hover:bg-white hover:shadow-sm'}`}
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
             
             <span className="text-sm font-medium text-gray-700">
               {t.pagination.page} {currentPage} / {totalPages}
             </span>

             <button 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full border border-vintage-border ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-vintage-dark hover:bg-white hover:shadow-sm'}`}
             >
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal (Only for Products) */}
      {isModalOpen && activeTab === 'products' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-serif font-bold text-vintage-dark">
                {currentProduct.id ? t.editProduct : t.addNewProduct}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.nameEn}</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.name?.en || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: {...currentProduct.name, en: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.nameVi}</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.category}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.price}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.qty}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.descEn}</label>
                  <textarea
                    rows="3"
                    value={currentProduct.description?.en || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, description: {...currentProduct.description, en: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.descVi}</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.image}</label>
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
                                {uploading ? t.form.uploading : t.form.upload}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                            <span className="text-xs text-gray-500">{t.form.orUrl}</span>
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
                  {t.form.cancel}
                </Button>
                <Button type="submit" className="flex items-center gap-2" disabled={uploading}>
                  <Save className="w-4 h-4" /> {t.form.save}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
