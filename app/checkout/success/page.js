'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Package, Mail, ArrowLeft, Home, Sparkles, Gift } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/formatPrice';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsRequest } from '@/store/slices/productsSlice';

const translations = {
  EN: {
    title: "Payment Successful!",
    thankYou: "Thank you for your purchase!",
    orderConfirmation: "Your order has been confirmed and an invoice has been sent to your email.",
    orderNumber: "Order Number",
    orderDetails: "Order Details",
    items: "Items",
    total: "Total",
    shippingAddress: "Shipping Address",
    paymentMethod: "Payment Method",
    continueShopping: "Continue Shopping",
    backToHome: "Back to Home",
    emailSent: "Invoice sent to",
    processing: "Loading order details..."
  },
  VI: {
    title: "Thanh Toán Thành Công!",
    thankYou: "Cảm ơn bạn đã mua hàng!",
    orderConfirmation: "Đơn hàng của bạn đã được xác nhận và hóa đơn đã được gửi đến email của bạn.",
    orderNumber: "Mã Đơn Hàng",
    orderDetails: "Chi Tiết Đơn Hàng",
    items: "Sản Phẩm",
    total: "Tổng Tiền",
    shippingAddress: "Địa Chỉ Giao Hàng",
    paymentMethod: "Phương Thức Thanh Toán",
    continueShopping: "Tiếp Tục Mua Sắm",
    backToHome: "Về Trang Chủ",
    emailSent: "Hóa đơn đã được gửi đến",
    processing: "Đang tải thông tin đơn hàng..."
  }
};

function CheckoutSuccessContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const t = translations[language];
  
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const products = useSelector((state) => state.products.items || []);

  // Fetch products if not loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProductsRequest());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('access_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/orders`, {
          headers
        });

        if (res.ok) {
          const orders = await res.json();
          const foundOrder = orders.find(o => o._id === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-paper dark:bg-vintage-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vintage-gold mx-auto mb-4"></div>
          <p className="text-vintage-dark dark:text-vintage-cream">{t.processing}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-vintage-paper dark:bg-vintage-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-vintage-dark dark:text-vintage-cream mb-4">Order not found</p>
          <Link href="/" className="text-vintage-gold hover:underline">
            {t.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  // Helper to get product image
  const getProductImage = (productId) => {
    if (!productId) return '/images/placeholder.png';
    
    // Try to find product in Redux store
    const product = products.find(p => p.id === productId || p.id === Number(productId));
    
    if (product?.image) {
      return product.image;
    }
    
    // Fallback: try to fetch from API if not in store
    // For now, return a default placeholder
    return '/images/placeholder.png';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-paper via-vintage-cream to-vintage-paper dark:from-vintage-dark dark:via-vintage-dark/95 dark:to-vintage-dark flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-vintage-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/10 dark:bg-pink-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vintage-gold/3 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Success Header with Animation */}
          <div className="text-center mb-10 relative">
            {/* Confetti Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Sparkles className="w-6 h-6 text-vintage-gold animate-pulse absolute top-0 left-1/4" />
              <Gift className="w-5 h-5 text-pink-400 animate-bounce absolute top-4 right-1/4" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="w-5 h-5 text-vintage-gold animate-pulse absolute bottom-0 left-1/3" style={{ animationDelay: '1s' }} />
            </div>

            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-full mb-6 shadow-lg animate-scale-in">
              <CheckCircle className="w-14 h-14 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-vintage-dark dark:text-vintage-cream mb-3 bg-gradient-to-r from-vintage-dark to-vintage-gold dark:from-vintage-cream dark:to-vintage-gold bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-2 font-medium">
              {t.thankYou}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.orderConfirmation}
            </p>
            {order.email && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-vintage-gold/10 dark:bg-vintage-gold/20 rounded-full border border-vintage-gold/30">
                <Mail className="w-4 h-4 text-vintage-gold" />
                <span className="text-sm text-vintage-dark dark:text-vintage-cream">
                  {t.emailSent} <span className="font-semibold">{order.email}</span>
                </span>
              </div>
            )}
          </div>

          {/* Order Details Card */}
          <div className="bg-white/90 dark:bg-vintage-dark/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-vintage-border/30 p-6 sm:p-8 mb-8 relative overflow-hidden">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-vintage-gold/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/10 dark:from-pink-900/10 to-transparent rounded-tr-full"></div>

            <div className="relative mb-6 pb-6 border-b-2 border-vintage-border/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-vintage-gold/10 dark:bg-vintage-gold/20 rounded-lg">
                  <Package className="w-6 h-6 text-vintage-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-vintage-dark dark:text-vintage-cream">
                    {t.orderNumber}
                  </h2>
                  <p className="text-sm font-mono text-vintage-gold font-semibold mt-1">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 relative">
              {/* Items with Images */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-4 bg-vintage-gold"></div>
                  {t.items}
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-vintage-dark/50 rounded-xl border border-vintage-border/20 hover:border-vintage-gold/30 transition-all group">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-vintage-border/30 group-hover:border-vintage-gold/50 transition-colors flex-shrink-0 bg-vintage-paper/50">
                        {getProductImage(item.productId) && getProductImage(item.productId) !== '/images/placeholder.png' ? (
                          <Image
                            src={getProductImage(item.productId)}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 640px) 80px, 96px"
                            onError={(e) => {
                              e.target.src = '/images/placeholder.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vintage-gold/20 to-vintage-gold/10">
                            <Package className="w-8 h-8 text-vintage-gold/50" />
                          </div>
                        )}
                        {/* Quantity Badge */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-vintage-gold text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10">
                          {item.quantity}
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-vintage-dark dark:text-vintage-cream line-clamp-2 group-hover:text-vintage-gold transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatPrice(item.price, language)} × {item.quantity}
                        </p>
                      </div>
                      
                      {/* Price */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-base sm:text-lg font-bold text-vintage-gold">
                          {formatPrice(item.price * item.quantity, language)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t-2 border-vintage-border/30">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-vintage-gold/5 to-pink-100/5 dark:from-vintage-gold/10 dark:to-pink-900/10 rounded-xl">
                  <span className="text-lg font-semibold text-vintage-dark dark:text-vintage-cream uppercase tracking-wide">
                    {t.total}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-vintage-gold">
                    {formatPrice(order.totalAmount / 100, language)}
                  </span>
                </div>
              </div>

              {/* Shipping Address & Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t-2 border-vintage-border/30">
                {order.shippingAddress && (
                  <div className="p-4 bg-gray-50/50 dark:bg-vintage-dark/50 rounded-xl border border-vintage-border/20">
                    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1 h-3 bg-vintage-gold"></div>
                      {t.shippingAddress}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {order.shippingAddress}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-gray-50/50 dark:bg-vintage-dark/50 rounded-xl border border-vintage-border/20">
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1 h-3 bg-vintage-gold"></div>
                    {t.paymentMethod}
                  </h3>
                  <p className="text-sm font-medium text-vintage-gold capitalize">
                    {order.paymentMethod === 'credit_card' ? 'Stripe' : order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-vintage-gold to-vintage-gold-hover text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-base relative overflow-hidden cursor-pointer"
            >
              <span className="relative z-10">{t.continueShopping}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-vintage-gold-hover to-vintage-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/80 dark:bg-vintage-dark/70 backdrop-blur-sm text-vintage-dark dark:text-vintage-cream border-2 border-vintage-border rounded-xl hover:border-vintage-gold hover:bg-white dark:hover:bg-vintage-dark transition-all duration-300 font-semibold text-base hover:shadow-lg cursor-pointer"
            >
              <Home className="w-5 h-5" />
              {t.backToHome}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-vintage-paper dark:bg-vintage-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vintage-gold mx-auto mb-4"></div>
          <p className="text-vintage-dark dark:text-vintage-cream">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

