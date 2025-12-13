'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/formatPrice';
import { Package, User, Mail, Calendar, MapPin, Filter, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const translations = {
  EN: {
    title: "My Profile",
    userInfo: "User Information",
    orderHistory: "Order History",
    username: "Username",
    role: "Role",
    noOrders: "You haven't placed any orders yet.",
    filterByDate: "Filter by Date",
    startDate: "Start Date",
    endDate: "End Date",
    clearFilter: "Clear Filter",
    noOrdersFound: "No orders found for the selected date range.",
    table: {
      id: "Order ID",
      date: "Date",
      items: "Items",
      total: "Total",
      status: "Status",
      address: "Shipping Address"
    },
    status: {
        pending: "Pending",
        paid: "Paid",
        shipped: "Shipped",
        completed: "Completed",
        cancelled: "Cancelled"
    },
    changePassword: "Change Password",
    changePasswordDesc: "Update your account password"
  },
  VI: {
    title: "Hồ Sơ Của Tôi",
    userInfo: "Thông Tin Tài Khoản",
    orderHistory: "Lịch Sử Mua Hàng",
    username: "Tên Đăng Nhập",
    role: "Vai Trò",
    noOrders: "Bạn chưa có đơn hàng nào.",
    filterByDate: "Lọc Theo Ngày",
    startDate: "Từ Ngày",
    endDate: "Đến Ngày",
    clearFilter: "Xóa Bộ Lọc",
    noOrdersFound: "Không tìm thấy đơn hàng nào trong khoảng thời gian đã chọn.",
    table: {
      id: "Mã Đơn",
      date: "Ngày Đặt",
      items: "Sản Phẩm",
      total: "Tổng Tiền",
      status: "Trạng Thái",
      address: "Địa Chỉ Giao Hàng"
    },
    status: {
        pending: "Chờ Xử Lý",
        paid: "Đã Thanh Toán",
        shipped: "Đã Gửi Hàng",
        completed: "Hoàn Thành",
        cancelled: "Đã Hủy"
    },
    changePassword: "Đổi Mật Khẩu",
    changePasswordDesc: "Cập nhật mật khẩu tài khoản của bạn"
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  
  const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') : false;

  useEffect(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('access_token');

    if (!token || !username) {
      router.push('/login');
      return;
    }

    setUser({ username, role });
    
    // Only fetch orders if not admin
    if (!localStorage.getItem('isAdmin')) {
        fetchOrders(username);
    } else {
        setLoading(false); // If admin, stop loading immediately
    }
  }, [router]);

  const fetchOrders = async (username) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/orders/user/${username}`, {
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
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vintage-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-bold text-vintage-dark mb-4">{t.title}</h1>
            <div className="h-1 w-24 bg-vintage-gold mx-auto rounded-full"></div>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-vintage-border/50">
            <div className="bg-vintage-paper/30 px-6 py-4 border-b border-vintage-border/50">
                <h2 className="text-xl font-serif font-semibold text-vintage-dark flex items-center gap-2">
                    <User className="w-5 h-5 text-vintage-gold" />
                    {t.userInfo}
                </h2>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-vintage-gold/10 p-3 rounded-full">
                        <User className="w-6 h-6 text-vintage-gold" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">{t.username}</p>
                        <p className="text-lg font-medium text-vintage-dark">{user?.username}</p>
                    </div>
                </div>
                
                {/* Change Password Link */}
                <div className="pt-4 border-t border-vintage-border/50">
                    <Link
                        href="/profile/change-password"
                        className="flex items-center justify-between group px-4 py-3 bg-vintage-paper/30 hover:bg-vintage-paper/50 rounded-lg transition-all duration-200 border border-vintage-border/50 hover:border-vintage-gold/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-vintage-gold/10 p-2 rounded-lg group-hover:bg-vintage-gold/20 transition-colors">
                                <Lock className="w-5 h-5 text-vintage-gold" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-vintage-dark group-hover:text-vintage-gold transition-colors">
                                    {t.changePassword}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t.changePasswordDesc}
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-vintage-gold group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
            </div>
          </div>

          {/* Orders Section - Hidden for Admin */}
          {!isAdmin && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-vintage-border/50">
                <div className="bg-vintage-paper/30 px-6 py-4 border-b border-vintage-border/50">
                    <h2 className="text-xl font-serif font-semibold text-vintage-dark flex items-center gap-2">
                        <Package className="w-5 h-5 text-vintage-gold" />
                        {t.orderHistory}
                    </h2>
                </div>
                
                {/* Date Filter */}
                <div className="px-6 py-4 border-b border-vintage-border/50 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Filter className="w-4 h-4 text-vintage-gold" />
                            {t.filterByDate}:
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">{t.startDate}</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vintage-gold text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">{t.endDate}</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || undefined}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vintage-gold text-sm"
                                />
                            </div>
                        </div>
                        {(startDate || endDate) && (
                            <button
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                {t.clearFilter}
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    {(() => {
                        const filteredOrders = orders.filter((order) => {
                            if (!startDate && !endDate) return true;
                            
                            const orderDate = new Date(order.createdAt);
                            orderDate.setHours(0, 0, 0, 0);
                            
                            if (startDate && endDate) {
                                const start = new Date(startDate);
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                return orderDate >= start && orderDate <= end;
                            }
                            
                            if (startDate) {
                                const start = new Date(startDate);
                                return orderDate >= start;
                            }
                            
                            if (endDate) {
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                return orderDate <= end;
                            }
                            
                            return true;
                        });

                        if (orders.length === 0) {
                            return (
                                <div className="p-12 text-center text-gray-500">
                                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p>{t.noOrders}</p>
                                </div>
                            );
                        }

                        if (filteredOrders.length === 0) {
                            return (
                                <div className="p-12 text-center text-gray-500">
                                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p>{t.noOrdersFound}</p>
                                </div>
                            );
                        }

                        return (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium border-b border-gray-200">{t.table.id}</th>
                                        <th className="p-4 font-medium border-b border-gray-200">{t.table.date}</th>
                                        <th className="p-4 font-medium border-b border-gray-200">{t.table.items}</th>
                                        <th className="p-4 font-medium border-b border-gray-200">{t.table.address}</th>
                                        <th className="p-4 font-medium border-b border-gray-200">{t.table.total}</th>
                                        <th className="p-4 font-medium border-b border-gray-200">{t.table.status}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                        <td className="p-4 font-mono text-xs text-gray-500" title={order._id}>
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <ul className="list-disc list-inside text-xs space-y-1 text-gray-600">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="truncate">
                                                        <span className="font-medium text-gray-800">{item.quantity}x</span> {item.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="p-4 max-w-xs truncate" title={order.shippingAddress}>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                                <span className="truncate">{order.shippingAddress}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-semibold text-vintage-dark">
                                            {formatPrice(order.totalAmount / 100, language)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${order.status === 'completed' || order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {t.status[order.status] || order.status}
                                            </span>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        );
                    })()}
                </div>
              </div>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

