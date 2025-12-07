'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Plus, X, Save, Upload, ChevronLeft, ChevronRight, Package, ShoppingBag, Search, Filter } from 'lucide-react';
import { 
    fetchProductsRequest, addProductRequest, updateProductRequest, deleteProductRequest 
} from '@/store/slices/productsSlice';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/formatPrice';

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
      createdAt: "Created Date",
      updatedAt: "Updated Date",
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
      discount: "Discount (%)",
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
    },
    sort: {
        lastUpdated: "Newest Update",
        newestCreated: "Newest Created",
        oldestCreated: "Oldest Created",
        priceLowHigh: "Price: Low to High",
        priceHighLow: "Price: High to Low",
        qtyLowHigh: "Qty: Low to High",
        qtyHighLow: "Qty: High to Low"
    },
    filter: {
        allCategories: "All Categories",
        allStatus: "All Status",
        status: {
            pending: "Pending",
            paid: "Paid",
            shipped: "Shipped",
            completed: "Completed",
            cancelled: "Cancelled"
        },
        filterByDate: "Filter by Date",
        startDate: "Start Date",
        endDate: "End Date",
        clearFilter: "Clear Filter"
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
      createdAt: "Ngày Tạo",
      updatedAt: "Ngày Cập Nhật",
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
      discount: "Giảm Giá (%)",
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
    },
    sort: {
        lastUpdated: "Cập Nhật Gần Nhất",
        newestCreated: "Mới Tạo Nhất",
        oldestCreated: "Cũ Nhất",
        priceLowHigh: "Giá: Thấp đến Cao",
        priceHighLow: "Giá: Cao đến Thấp",
        qtyLowHigh: "SL: Thấp đến Cao",
        qtyHighLow: "SL: Cao đến Thấp"
    },
    filter: {
        allCategories: "Tất Cả Danh Mục",
        allStatus: "Tất Cả Trạng Thái",
        status: {
            pending: "Chờ Xử Lý",
            paid: "Đã Thanh Toán",
            shipped: "Đã Gửi Hàng",
            completed: "Hoàn Thành",
            cancelled: "Đã Hủy"
        },
        filterByDate: "Lọc Theo Ngày",
        startDate: "Từ Ngày",
        endDate: "Đến Ngày",
        clearFilter: "Xóa Bộ Lọc"
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

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [orderStartDate, setOrderStartDate] = useState('');
  const [orderEndDate, setOrderEndDate] = useState('');

  // Pagination State
  const itemsPerPage = 20;

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

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
    
    // Reset filters on tab change
    setFilterValue('All');
    setSearchTerm('');
    setSortConfig({ key: 'createdAt', direction: 'desc' });
    setOrderStartDate('');
    setOrderEndDate('');

    // Initial fetch based on tab
    if (activeTab === 'products') {
        dispatch(fetchProductsRequest());
    } else {
        fetchOrders();
    }
  }, [dispatch, router, activeTab]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isModalOpen]);

  const fetchOrders = async () => {
      setOrdersLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    // API expects 'files' field for multiple upload
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const token = localStorage.getItem('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      // data.urls is array of strings
      
      setCurrentProduct(prev => {
          const newImages = [...(prev.images || []), ...data.urls];
          // Default main image to first one if not set
          const mainImage = prev.image || newImages[0] || '';
          return { ...prev, images: newImages, image: mainImage };
      });
    } catch (err) {
      alert('Failed to upload image');
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input value to allow re-uploading same file
      e.target.value = null;
    }
  };

  const removeImage = (indexToRemove) => {
      setCurrentProduct(prev => {
          const newImages = prev.images.filter((_, index) => index !== indexToRemove);
          // If we removed the main image, set new main image
          let newMainImage = prev.image;
          if (prev.images[indexToRemove] === prev.image) {
              newMainImage = newImages.length > 0 ? newImages[0] : '';
          }
          return { ...prev, images: newImages, image: newMainImage };
      });
  };

  const setMainImage = (imgUrl) => {
      setCurrentProduct(prev => ({ ...prev, image: imgUrl }));
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
        discount: Number(currentProduct.discount || 0),
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
      discount: 0,
      quantity: 0,
      image: '',
      images: [],
      rating: 5
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    const p = JSON.parse(JSON.stringify(product));
    // Ensure images array exists
    if (!p.images) p.images = p.image ? [p.image] : [];
    setCurrentProduct(p);
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

  // Sort options
  const productSortOptions = [
      { label: t.sort.lastUpdated, key: 'updatedAt', direction: 'desc' },
      { label: t.sort.newestCreated, key: 'createdAt', direction: 'desc' },
      { label: t.sort.oldestCreated, key: 'createdAt', direction: 'asc' },
      { label: t.sort.priceLowHigh, key: 'price', direction: 'asc' },
      { label: t.sort.priceHighLow, key: 'price', direction: 'desc' },
      { label: t.sort.qtyLowHigh, key: 'quantity', direction: 'asc' },
      { label: t.sort.qtyHighLow, key: 'quantity', direction: 'desc' },
  ];

  const orderSortOptions = [
      { label: t.sort.lastUpdated, key: 'createdAt', direction: 'desc' },
      { label: t.sort.oldestCreated, key: 'createdAt', direction: 'asc' },
  ];

  // Filter items based on search term
  const filteredItems = (activeTab === 'products' ? products : orders).filter(item => {
      // 1. Filter by Dropdown
      if (filterValue !== 'All') {
          if (activeTab === 'products') {
               const catEn = (typeof item.category === 'object' ? item.category.en : item.category) || '';
               if (catEn !== filterValue) return false;
          } else {
               if (item.status !== filterValue) return false;
          }
      }

      // 2. Filter by Date (for orders only)
      if (activeTab === 'orders' && (orderStartDate || orderEndDate)) {
          const orderDate = new Date(item.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          
          if (orderStartDate && orderEndDate) {
              const start = new Date(orderStartDate);
              const end = new Date(orderEndDate);
              end.setHours(23, 59, 59, 999);
              if (orderDate < start || orderDate > end) return false;
          } else if (orderStartDate) {
              const start = new Date(orderStartDate);
              if (orderDate < start) return false;
          } else if (orderEndDate) {
              const end = new Date(orderEndDate);
              end.setHours(23, 59, 59, 999);
              if (orderDate > end) return false;
          }
      }

      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      if (activeTab === 'products') {
          // Filter products by name (en/vi) or category
          const nameEn = item.name?.en?.toLowerCase() || item.name?.toLowerCase() || '';
          const nameVi = item.name?.vi?.toLowerCase() || '';
          const catEn = item.category?.en?.toLowerCase() || item.category?.toLowerCase() || '';
          return nameEn.includes(term) || nameVi.includes(term) || catEn.includes(term);
      } else {
          // Filter orders by ID, customer name, or email
          const id = item._id.toLowerCase();
          const user = item.username?.toLowerCase() || '';
          const email = item.email?.toLowerCase() || '';
          return id.includes(term) || user.includes(term) || email.includes(term);
      }
  }).sort((a, b) => {
      if (activeTab === 'products') {
          let valA = a[sortConfig.key];
          let valB = b[sortConfig.key];

          if (sortConfig.key === 'createdAt') {
             valA = new Date(valA || a.updatedAt || 0).getTime();
             valB = new Date(valB || b.updatedAt || 0).getTime();
          } else if (sortConfig.key === 'updatedAt') {
             valA = new Date(valA || a.createdAt || 0).getTime();
             valB = new Date(valB || b.createdAt || 0).getTime();
          }

          if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      }

      let orderValA = a[sortConfig.key];
      let orderValB = b[sortConfig.key];

      if (sortConfig.key === 'createdAt') {
          orderValA = new Date(orderValA || 0).getTime();
          orderValB = new Date(orderValB || 0).getTime();
      } else if (sortConfig.key === 'totalAmount') {
          orderValA = orderValA || 0;
          orderValB = orderValB || 0;
      }

      if (orderValA < orderValB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (orderValA > orderValB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
  });

  // Pagination Logic
  const currentItems = filteredItems;
  const loading = activeTab === 'products' ? productsLoading : ordersLoading;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = currentItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);

  // Helper function to update URL params
  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/dashboard?${params.toString()}`);
  };

  // Update URL params when page changes
  const paginate = (pageNumber) => {
    updateUrlParams({ page: pageNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page to 1 in URL
  const resetPage = () => {
    updateUrlParams({ page: 1 });
  };

  if (loading && currentItems.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-serif font-bold text-vintage-dark">{t.title}</h1>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Sort Dropdown */}
              <select
                  value={`${sortConfig.key}-${sortConfig.direction}`}
                  onChange={(e) => { 
                      const [key, direction] = e.target.value.split('-');
                      setSortConfig({ key, direction }); 
                      resetPage();
                  }}
                  className="w-full sm:w-48 px-3 py-2 rounded-md border border-vintage-border focus:outline-none focus:ring-1 focus:ring-vintage-gold bg-white cursor-pointer text-sm"
              >
                  {(activeTab === 'products' ? productSortOptions : orderSortOptions).map((opt, idx) => (
                      <option key={idx} value={`${opt.key}-${opt.direction}`}>{opt.label}</option>
                  ))}
              </select>

              {/* Filter Dropdown */}
              <select
                  value={filterValue}
                  onChange={(e) => { setFilterValue(e.target.value); resetPage(); }}
                  className="w-full sm:w-48 px-3 py-2 rounded-md border border-vintage-border focus:outline-none focus:ring-1 focus:ring-vintage-gold bg-white cursor-pointer text-sm"
              >
                  <option value="All">{activeTab === 'products' ? t.filter.allCategories : t.filter.allStatus}</option>
                  {activeTab === 'products' ? (
                      categories.map(cat => (
                          <option key={cat.en} value={cat.en}>{cat.en} / {cat.vi}</option>
                      ))
                  ) : (
                      ['pending', 'paid', 'shipped', 'completed', 'cancelled'].map(status => (
                          <option key={status} value={status} className="capitalize">
                             {t.filter.status[status] || status}
                          </option>
                      ))
                  )}
              </select>

              {/* Search Input */}
              <div className="relative flex-grow sm:flex-grow-0">
                  <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-md border border-vintage-border focus:outline-none focus:ring-1 focus:ring-vintage-gold bg-white"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {activeTab === 'products' && (
                <Button onClick={openAddModal} className="flex items-center gap-2 whitespace-nowrap">
                    <Plus className="w-4 h-4" /> {t.addProduct}
                </Button>
              )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
                onClick={() => { setActiveTab('products'); resetPage(); }}
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
                onClick={() => { setActiveTab('orders'); resetPage(); }}
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

        {/* Date Filter for Orders */}
        {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow border border-vintage-border p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Filter className="w-4 h-4 text-vintage-gold" />
                        {t.filter.filterByDate}:
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">{t.filter.startDate}</label>
                            <input
                                type="date"
                                value={orderStartDate}
                                onChange={(e) => { setOrderStartDate(e.target.value); resetPage(); }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vintage-gold text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">{t.filter.endDate}</label>
                            <input
                                type="date"
                                value={orderEndDate}
                                onChange={(e) => { setOrderEndDate(e.target.value); resetPage(); }}
                                min={orderStartDate || undefined}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vintage-gold text-sm"
                            />
                        </div>
                    </div>
                    {(orderStartDate || orderEndDate) && (
                        <button
                            onClick={() => {
                                setOrderStartDate('');
                                setOrderEndDate('');
                                resetPage();
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            {t.filter.clearFilter}
                        </button>
                    )}
                </div>
            </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden border border-vintage-border overflow-x-auto">
          {activeTab === 'products' ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.id}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.form.image}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.name}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.category}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.price}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.qty}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.createdAt}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.updatedAt}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                              {product.image ? (
                                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                              ) : (
                                  <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                              )}
                          </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm font-medium text-gray-900 break-words">{product.name?.en || product.name}</div>
                        <div className="text-xs text-gray-500 break-words">{product.name?.vi}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.en || product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.createdAt 
                          ? new Date(product.createdAt).toLocaleDateString(language === 'VI' ? 'vi-VN' : 'en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.updatedAt 
                          ? new Date(product.updatedAt).toLocaleDateString(language === 'VI' ? 'vi-VN' : 'en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'}
                      </td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount / 100, language)}
                      </td>
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
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-6">
            <button 
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-vintage-dark dark:disabled:hover:text-vintage-cream transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'VI' ? 'Trước' : 'Previous'}</span>
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Always show first page */}
              {currentPage > 3 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => paginate(1)}
                    className="px-3 sm:px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold transition-all duration-300 text-sm sm:text-base cursor-pointer"
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="px-2 text-vintage-dark dark:text-vintage-cream">...</span>}
                </>
              )}

              {/* Show pages around current page */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Exclude pages already shown in "Always show first/last page"
                  const showFirstPage = currentPage > 3 && totalPages > 5;
                  const showLastPage = currentPage < totalPages - 2 && totalPages > 5;
                  
                  if (showFirstPage && page === 1) return false; // Exclude first page if already shown
                  if (showLastPage && page === totalPages) return false; // Exclude last page if already shown
                  
                  if (totalPages <= 7) return true; // Show all if 7 or fewer pages
                  if (currentPage <= 3) return page <= 5; // Show first 5 if near start
                  if (currentPage >= totalPages - 2) return page >= totalPages - 4; // Show last 5 if near end
                  return Math.abs(page - currentPage) <= 2; // Show 2 pages on each side
                })
                .map(page => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 sm:px-4 py-2 border rounded-sm transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                      page === currentPage
                        ? 'bg-vintage-gold text-white border-vintage-gold font-semibold'
                        : 'border-vintage-border text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold'
                    }`}
                  >
                    {page}
                  </button>
                ))}

              {/* Always show last page */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 text-vintage-dark dark:text-vintage-cream">...</span>}
                  <button
                    onClick={() => paginate(totalPages)}
                    className="px-3 sm:px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold transition-all duration-300 text-sm sm:text-base cursor-pointer"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button 
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-vintage-dark dark:disabled:hover:text-vintage-cream transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              <span className="hidden sm:inline">{language === 'VI' ? 'Sau' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal (Only for Products) */}
      {isModalOpen && activeTab === 'products' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
            data-lenis-prevent
          >
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.nameVi}</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.name?.vi || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: {...currentProduct.name, vi: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-gray-900 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold cursor-pointer text-gray-900 bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat.en} value={cat.en}>{cat.en} / {cat.vi}</option>
                  ))}
                </select>
              </div>

              {/* Price, Discount & Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.price}</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.discount}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentProduct.discount || 0}
                    onChange={(e) => setCurrentProduct({...currentProduct, discount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-gray-900 bg-white"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.descEn}</label>
                  <textarea
                    rows="8"
                    value={currentProduct.description?.en || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, description: {...currentProduct.description, en: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-gray-900 bg-white resize-y min-h-[150px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.descVi}</label>
                  <textarea
                    rows="8"
                    value={currentProduct.description?.vi || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, description: {...currentProduct.description, vi: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-gray-900 bg-white resize-y min-h-[150px]"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.form.image}</label>
                
                {/* Image List */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                    {currentProduct.images && currentProduct.images.map((img, idx) => (
                        <div key={idx} className={`relative aspect-square rounded-md overflow-hidden border-2 group ${currentProduct.image === img ? 'border-vintage-gold' : 'border-gray-200'}`}>
                            <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                            
                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setMainImage(img)}
                                    className={`px-2 py-1 text-xs rounded bg-white hover:bg-gray-100 ${currentProduct.image === img ? 'text-vintage-gold font-bold' : 'text-gray-700'}`}
                                >
                                    {currentProduct.image === img ? 'Main' : 'Set Main'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {currentProduct.image === img && (
                                <div className="absolute top-1 right-1 w-3 h-3 bg-vintage-gold rounded-full border border-white"></div>
                            )}
                        </div>
                    ))}
                    
                    {/* Upload Button Block */}
                    <label className="relative aspect-square rounded-md border-2 border-dashed border-gray-300 hover:border-vintage-gold hover:bg-gray-50 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-vintage-gold">
                        <div className="flex flex-col items-center gap-1 p-2 text-center">
                            <Upload className="w-6 h-6" />
                            <span className="text-xs font-medium">{uploading ? t.form.uploading : t.form.upload}</span>
                            <span className="text-[10px] text-gray-400">Multiple allowed</span>
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                    </label>
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
