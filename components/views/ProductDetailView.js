'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductRequest } from '@/store/slices/productsSlice';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { Star, Truck, ShieldCheck, RotateCcw, ChevronDown, ChevronUp, Lock, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Country, State } from 'country-state-city';
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';

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
    secureText: "Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.",
    quantity: "Quantity"
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
    secureText: "Thông tin thanh toán của bạn được xử lý an toàn. Chúng tôi không lưu trữ thông tin thẻ tín dụng cũng như không có quyền truy cập vào thông tin thẻ tín dụng của bạn.",
    quantity: "Số lượng"
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
  
  // Image Gallery State
  const [activeImage, setActiveImage] = useState(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Purchase Quantity State
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  const handleMouseMove = (e) => {
      if (!showZoom) return;
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      
      // Calculate mouse position relative to image container
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      setMousePosition({ x, y });

      // Calculate background position percentages
      // We want the zoom to follow the cursor
      let bgX = (x / width) * 100;
      let bgY = (y / height) * 100;
      
      setZoomPosition({ x: bgX, y: bgY });
  };

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
      if (product) {
          setActiveImage(product.image);
      }
  }, [product]);

  useEffect(() => {
      const countryStates = State.getStatesOfCountry(shippingCountry);
      setStates(countryStates);
      if (countryStates.length > 0) {
          setShippingState(countryStates[0].isoCode);
      } else {
          setShippingState('');
      }
  }, [shippingCountry]);

  // Reset purchase quantity when product changes or stock changes
  useEffect(() => {
    if (product?.id) {
      setPurchaseQuantity(1);
    }
  }, [product?.id, product?.quantity]);

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
  
  const stockQuantity = product.quantity || 0;
  const sold = product.sold || 0;
  const discount = product.discount || 0;
  const isOutOfStock = stockQuantity === 0;
  const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') : false;

  // Calculate discounted price
  const discountedPrice = discount > 0 
    ? product.price * (1 - discount / 100) 
    : product.price;

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          
          {/* Image Section */}
          <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
             {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
             {product.images && product.images.length > 0 && (
                 <div 
                    className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 md:max-h-[500px] scrollbar-hide"
                    data-lenis-prevent
                 >
                     {product.images.map((img, idx) => (
                         <button 
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === img ? 'border-vintage-gold ring-1 ring-vintage-gold' : 'border-gray-200 hover:border-vintage-gold/50'}`}
                         >
                             <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                         </button>
                     ))}
                 </div>
             )}

             {/* Main Image */}
             <div 
                className="relative flex-grow aspect-square w-full rounded-lg bg-white border border-vintage-border dark:border-vintage-border/20 cursor-crosshair group z-20"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
             >
                {activeImage ? (
                  <>
                    <div className="relative w-full h-full overflow-hidden rounded-lg">
                        <Image
                            src={activeImage}
                            alt={name}
                            fill
                            className="object-contain object-center p-4"
                            priority
                        />
                    </div>
                    
                    {/* Zoom Lens (The box following the cursor) */}
                    {showZoom && !isOutOfStock && (
                        <div 
                            className="absolute pointer-events-none border border-vintage-gold/50 bg-vintage-gold/10 hidden md:block z-30"
                            style={{
                                left: Math.max(0, Math.min(mousePosition.x - 75, typeof window !== 'undefined' ? window.innerWidth : 1000)), // Simple clamping, usually container width needed
                                top: Math.max(0, Math.min(mousePosition.y - 75, typeof window !== 'undefined' ? window.innerHeight : 1000)),
                                width: '150px',
                                height: '150px',
                                transform: 'translate(0, 0)', // We handle positioning manually for smoother sync
                                left: `${mousePosition.x - 75}px`,
                                top: `${mousePosition.y - 75}px`,
                            }}
                        />
                    )}

                    {/* Zoom Window (Flyout) */}
                    {showZoom && !isOutOfStock && (
                        <div 
                            className="hidden md:block absolute z-50 overflow-hidden border-2 border-vintage-gold bg-white shadow-2xl rounded-md"
                            style={{
                                left: '105%', 
                                top: '0',
                                width: '500px', 
                                height: '500px',
                                backgroundImage: `url(${activeImage})`,
                                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                backgroundSize: '250%', // 2.5x Zoom
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 pointer-events-none rounded-lg">
                        <span className="text-white font-bold text-xl px-6 py-2 border-2 border-white uppercase tracking-widest">
                            {t.soldOut}
                        </span>
                    </div>
                )}
              </div>
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
                {stockQuantity} {t.left}
              </span>
            </div>

            <div className="mb-8 flex items-center gap-4">
                {discount > 0 ? (
                    <>
                        <p className="text-3xl font-medium text-red-600">
                          {formatPrice(discountedPrice, language)}
                        </p>
                        <div className="flex flex-col">
                            <span className="text-lg text-gray-500 line-through">
                                {formatPrice(product.price, language)}
                            </span>
                            <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded max-w-max">
                                Save {discount}%
                            </span>
                        </div>
                    </>
                ) : (
                    <p className="text-3xl font-medium text-vintage-dark dark:text-vintage-cream">
                      {formatPrice(product.price, language)}
                    </p>
                )}
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-xl font-serif font-semibold text-vintage-dark dark:text-vintage-cream mb-4 pb-2 border-b border-vintage-border dark:border-vintage-border/20">
                {t.description}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-4">
                  {description ? (
                    <p className="text-base md:text-lg">{description}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      {language === 'VI' ? 'Chưa có mô tả sản phẩm' : 'No product description available'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-6">
              {!isAdmin && (
                <>
                  {/* Quantity Selector */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-vintage-dark dark:text-vintage-cream">
                      {t.quantity}
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-vintage-border dark:border-vintage-border/20 rounded-md overflow-hidden bg-white dark:bg-vintage-dark/30">
                        <button
                          onClick={() => setPurchaseQuantity((prev) => Math.max(1, prev - 1))}
                          disabled={purchaseQuantity <= 1 || isOutOfStock}
                          className="p-3 hover:bg-vintage-paper dark:hover:bg-vintage-border/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4 text-vintage-dark dark:text-vintage-cream" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={stockQuantity}
                          value={purchaseQuantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            const clampedValue = Math.max(1, Math.min(stockQuantity, value));
                            setPurchaseQuantity(clampedValue);
                          }}
                          disabled={isOutOfStock}
                          className="w-16 text-center text-base font-medium text-vintage-dark dark:text-vintage-cream bg-transparent border-0 focus:outline-none disabled:opacity-50"
                        />
                        <button
                          onClick={() => setPurchaseQuantity((prev) => Math.min(stockQuantity, prev + 1))}
                          disabled={purchaseQuantity >= stockQuantity || isOutOfStock}
                          className="p-3 hover:bg-vintage-paper dark:hover:bg-vintage-border/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 text-vintage-dark dark:text-vintage-cream" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'VI' 
                          ? `Còn ${stockQuantity} sản phẩm` 
                          : `${stockQuantity} available`}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    className="w-full py-4 text-lg"
                    onClick={() => addToCart({ ...product, price: discountedPrice }, purchaseQuantity)}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? t.soldOut : t.addToCart}
                  </Button>
                </>
              )}

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

        {/* Additional Information Section */}
        <div className="mt-16 border-t border-vintage-border dark:border-vintage-border/20 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Details */}
            <div className="bg-white dark:bg-vintage-dark/30 rounded-lg p-6 border border-vintage-border dark:border-vintage-border/20">
              <h3 className="text-xl font-serif font-semibold text-vintage-dark dark:text-vintage-cream mb-4">
                {language === 'VI' ? 'Chi Tiết Sản Phẩm' : 'Product Details'}
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {language === 'VI' ? 'Danh Mục' : 'Category'}
                  </dt>
                  <dd className="text-sm font-semibold text-vintage-dark dark:text-vintage-cream">
                    {category}
                  </dd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {language === 'VI' ? 'Đánh Giá' : 'Rating'}
                  </dt>
                  <dd className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-vintage-gold text-vintage-gold" />
                    <span className="text-sm font-semibold text-vintage-dark dark:text-vintage-cream">
                      {product.rating?.toFixed(1) || 'N/A'}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {language === 'VI' ? 'Đã Bán' : 'Sold'}
                  </dt>
                  <dd className="text-sm font-semibold text-vintage-dark dark:text-vintage-cream">
                    {sold}
                  </dd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {language === 'VI' ? 'Tồn Kho' : 'Stock'}
                  </dt>
                  <dd className={`text-sm font-semibold ${stockQuantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stockQuantity > 0 ? `${stockQuantity} ${language === 'VI' ? 'sản phẩm' : 'items'}` : (language === 'VI' ? 'Hết hàng' : 'Out of Stock')}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Shipping & Returns Info */}
            <div className="bg-white dark:bg-vintage-dark/30 rounded-lg p-6 border border-vintage-border dark:border-vintage-border/20">
              <h3 className="text-xl font-serif font-semibold text-vintage-dark dark:text-vintage-cream mb-4">
                {t.shipping}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-vintage-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-vintage-dark dark:text-vintage-cream mb-1">
                      {t.freeShipping}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'VI' 
                        ? 'Đơn hàng trên $50 được miễn phí vận chuyển toàn quốc' 
                        : 'Orders over $50 qualify for free shipping nationwide'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-vintage-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-vintage-dark dark:text-vintage-cream mb-1">
                      {t.returns}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'VI' 
                        ? 'Bạn có thể trả hàng trong vòng 30 ngày kể từ ngày nhận hàng' 
                        : 'You can return items within 30 days of receiving your order'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-vintage-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-vintage-dark dark:text-vintage-cream mb-1">
                      {t.secure}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'VI' 
                        ? 'Thanh toán được mã hóa và bảo mật hoàn toàn' 
                        : 'All payments are encrypted and fully secure'}
                    </p>
                  </div>
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

