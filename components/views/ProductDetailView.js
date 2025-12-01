'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductRequest } from '@/store/slices/productsSlice';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { Star, Truck, ShieldCheck, RotateCcw, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Country, State } from 'country-state-city';
import Link from 'next/link';

const translations = {
  EN: {
    addToCart: "Add to Cart",
    soldOut: "Sold Out",
    description: "Description",
    shipping: "Shipping & Returns",
    freeShipping: "Free shipping on orders over $50",
    secure: "Secure checkout",
    returns: "30-day return policy",
    sold: "sold",
    left: "left in stock",
    category: "Category",
    estimateShipping: "Estimate Shipping Cost",
    country: "Country",
    state: "State",
    zip: "Zip Code",
    estimate: "Estimate",
    shippingPolicy: "Shipping Policy",
    refundPolicy: "Refund Policy",
    paymentSecurity: "Payment & Security",
    secureText: "Your payment information is processed securely. We do not store credit card details nor have access to your credit card information."
  },
  VI: {
    addToCart: "Thêm vào giỏ",
    soldOut: "Hết hàng",
    description: "Mô tả",
    shipping: "Vận chuyển & Đổi trả",
    freeShipping: "Miễn phí vận chuyển cho đơn trên $50",
    secure: "Thanh toán bảo mật",
    returns: "Đổi trả trong 30 ngày",
    sold: "đã bán",
    left: "còn trong kho",
    category: "Danh mục",
    estimateShipping: "Ước Tính Phí Vận Chuyển",
    country: "Quốc Gia",
    state: "Tỉnh/Thành Phố",
    zip: "Mã Bưu Chính",
    estimate: "Ước Tính",
    shippingPolicy: "Chính Sách Vận Chuyển",
    refundPolicy: "Chính Sách Hoàn Tiền",
    paymentSecurity: "Thanh Toán & Bảo Mật",
    secureText: "Thông tin thanh toán của bạn được xử lý an toàn. Chúng tôi không lưu trữ thông tin thẻ tín dụng cũng như không có quyền truy cập vào thông tin thẻ tín dụng của bạn."
  }
};

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-t border-vintage-border dark:border-vintage-border/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="font-medium text-vintage-dark dark:text-vintage-cream">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="pb-4 text-sm text-gray-600 dark:text-gray-400">{children}</div>}
    </div>
  );
};

export default function ProductDetailView({ id }) {
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  const langKey = language.toLowerCase();
  const [mounted, setMounted] = useState(false);
  
  // Shipping Estimate State
  const [shippingCountry, setShippingCountry] = useState('US');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCost, setShippingCost] = useState(null);
  const [shippingError, setShippingError] = useState(null);
  const [states, setStates] = useState([]);
  const countries = Country.getAllCountries();

  useEffect(() => {
    setMounted(true);
    // Clear previous product state to avoid flashing old data
    // But this might cause flicker if we navigate quickly.
    // Ideally reset on unmount or id change.
    // For now, just fetch.
    if (id) {
      dispatch(fetchProductRequest(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
      const countryStates = State.getStatesOfCountry(shippingCountry);
      setStates(countryStates);
      if (countryStates.length > 0) {
          setShippingState(countryStates[0].isoCode);
      } else {
          setShippingState('');
      }
  }, [shippingCountry]);

  const handleEstimateShipping = () => {
      if (!shippingZip) {
          setShippingError(language === 'VI' ? "Vui lòng nhập mã bưu chính" : "Please enter a valid Zip Code");
          setShippingCost(null);
          return;
      }
      // Mock Logic
      setShippingError(null);
      if (shippingCountry === 'US') {
          setShippingCost("$5.99");
      } else if (shippingCountry === 'VN') {
          setShippingCost("50,000₫");
      } else {
          setShippingCost("$15.00");
      }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-cream dark:bg-vintage-dark flex items-center justify-center">
        <p className="text-vintage-dark dark:text-vintage-cream">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-vintage-dark flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                 <p className="text-vintage-dark dark:text-vintage-cream">Product not found</p>
            </div>
            <Footer />
        </div>
    );
  }

  const name = typeof product.name === 'object' ? product.name[langKey] : product.name;
  const description = typeof product.description === 'object' ? product.description[langKey] : product.description;
  const category = typeof product.category === 'object' ? product.category[langKey] : product.category;
  
  const quantity = product.quantity || 0;
  const sold = product.sold || 0;
  const isOutOfStock = quantity === 0;

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Image Section */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-vintage-dark/50 border border-vintage-border dark:border-vintage-border/20">
            {product.image ? (
              <Image
                src={product.image}
                alt={name}
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
            )}
            {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-xl px-6 py-2 border-2 border-white uppercase tracking-widest">
                        {t.soldOut}
                    </span>
                </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="mb-2">
                <span className="text-sm text-vintage-gold uppercase tracking-wider font-medium">{category}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-vintage-dark dark:text-vintage-cream mb-4">
              {name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-vintage-gold">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1 font-medium text-vintage-dark dark:text-vintage-cream">{product.rating}</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {sold} {t.sold}
              </span>
               <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
               <span className="text-gray-600 dark:text-gray-400 text-sm">
                {quantity} {t.left}
              </span>
            </div>

            <p className="text-2xl font-medium text-vintage-dark dark:text-vintage-cream mb-8">
              ${product.price}
            </p>

            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 mb-8 max-w-none">
               <p>{description}</p>
            </div>

            <div className="mt-auto space-y-6">
              <Button
                size="lg"
                className="w-full py-4 text-lg"
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? t.soldOut : t.addToCart}
              </Button>

              {/* Shipping Estimator */}
              <div className="bg-gray-50 dark:bg-vintage-dark/30 p-6 rounded-lg border border-vintage-border dark:border-vintage-border/20">
                <h3 className="text-lg font-medium text-vintage-dark dark:text-vintage-cream mb-4">{t.estimateShipping}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t.country}</label>
                        <select 
                            value={shippingCountry}
                            onChange={(e) => setShippingCountry(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-vintage-dark border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-vintage-gold transition-colors text-vintage-dark dark:text-vintage-cream"
                        >
                            {countries.map((c) => (
                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t.state}</label>
                        {states.length > 0 ? (
                            <select 
                                value={shippingState}
                                onChange={(e) => setShippingState(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white dark:bg-vintage-dark border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-vintage-gold transition-colors text-vintage-dark dark:text-vintage-cream"
                            >
                                {states.map((s) => (
                                    <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 text-sm bg-white dark:bg-vintage-dark border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-vintage-gold transition-colors text-vintage-dark dark:text-vintage-cream"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t.zip}</label>
                        <input 
                            type="text" 
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-vintage-dark border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-vintage-gold transition-colors text-vintage-dark dark:text-vintage-cream"
                        />
                    </div>
                </div>
                <Button 
                    size="sm" 
                    onClick={handleEstimateShipping}
                    className="mt-4 w-full md:w-auto"
                >
                    {t.estimate}
                </Button>
                {shippingCost && (
                    <div className="mt-3 text-sm font-medium text-green-600 dark:text-green-400">
                        Estimated: {shippingCost}
                    </div>
                )}
                {shippingError && (
                    <div className="mt-3 text-sm font-medium text-red-500">
                        {shippingError}
                    </div>
                )}
              </div>
              
              {/* Policies */}
              <div className="space-y-1">
                  <CollapsibleSection title={t.refundPolicy}>
                      <Link href="/refund" className="underline hover:text-vintage-gold">Read our full refund policy here.</Link>
                  </CollapsibleSection>
                  <CollapsibleSection title={t.shippingPolicy}>
                      <Link href="/shipping" className="underline hover:text-vintage-gold">Read our shipping policy here.</Link>
                  </CollapsibleSection>
              </div>

              {/* Payment & Security */}
              <div className="border border-vintage-border dark:border-vintage-border/20 rounded-lg p-4 bg-white dark:bg-vintage-dark/30">
                  <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-vintage-dark dark:text-vintage-cream">{t.paymentSecurity}</h3>
                      <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex gap-1 mb-3 flex-wrap">
                        <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-full w-full object-contain" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-full w-full object-contain" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-full w-full object-contain" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-full w-full object-contain" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-full w-full object-contain" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282018%29.svg" alt="Google Pay" className="h-full w-full object-contain" />
                        </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.secureText}
                  </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-vintage-border dark:border-vintage-border/20 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Truck className="w-5 h-5 text-vintage-gold" />
                    <span>{t.freeShipping}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <ShieldCheck className="w-5 h-5 text-vintage-gold" />
                    <span>{t.secure}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <RotateCcw className="w-5 h-5 text-vintage-gold" />
                    <span>{t.returns}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

