'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsRequest } from '@/store/slices/productsSlice';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ProductGrid from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

const translations = {
  EN: {
    philosophyTitle: "Our Philosophy",
    philosophyText: "We believe in the elegance of the past. Our collection is carefully curated to bring the sophistication of vintage aesthetics to modern nail artistry. Quality, history, and beauty in every tool.",
    joinClubTitle: "Join the Vintage Club",
    joinClubText: "Get exclusive access to limited edition vintage finds and professional discounts.",
    signUp: "Sign Up Now",
    heroTitle1: "Timeless Beauty for",
    heroTitle2: "Modern Artistry",
    heroText: "Discover our curated collection of premium nail supplies. From classic polishes to professional tools, we bring the vintage aesthetic to your salon.",
    shopCollection: "Shop Collection",
    featuredCollections: "Featured Collections",
    newArrivals: "New Arrivals",
    seeAll: "See All"
  },
  VI: {
    philosophyTitle: "Triết Lý Của Chúng Tôi",
    philosophyText: "Chúng tôi tin vào vẻ đẹp thanh lịch của quá khứ. Bộ sưu tập của chúng tôi được tuyển chọn kỹ lưỡng để mang sự tinh tế của thẩm mỹ cổ điển vào nghệ thuật làm móng hiện đại. Chất lượng, lịch sử và vẻ đẹp trong từng dụng cụ.",
    joinClubTitle: "Tham Gia Câu Lạc Bộ Vintage",
    joinClubText: "Nhận quyền truy cập độc quyền vào các sản phẩm vintage giới hạn và giảm giá chuyên nghiệp.",
    signUp: "Đăng Ký Ngay",
    heroTitle1: "Vẻ Đẹp Vượt Thời Gian cho",
    heroTitle2: "Nghệ Thuật Hiện Đại",
    heroText: "Khám phá bộ sưu tập dụng cụ làm móng cao cấp của chúng tôi. Từ sơn móng cổ điển đến dụng cụ chuyên nghiệp, chúng tôi mang thẩm mỹ vintage đến salon của bạn.",
    shopCollection: "Mua Sắm Ngay",
    featuredCollections: "Bộ Sưu Tập Nổi Bật",
    newArrivals: "Hàng Mới Về",
    seeAll: "Xem Tất Cả"
  }
};

export default function HomeView() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
  // Ensure products is always an array to prevent runtime errors
  const products = Array.isArray(items) ? items : [];

  const { language } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isFading, setIsFading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    dispatch(fetchProductsRequest());
  }, [dispatch]);
  
  useEffect(() => {
    if (language !== currentLanguage) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setCurrentLanguage(language);
        setIsFading(false);
      }, 100); // Decreased delay for snappier transition
      return () => clearTimeout(timer);
    }
  }, [language, currentLanguage]);

  const t = translations[currentLanguage];

  // Display only first 8 products for the homepage
  const featuredProducts = products.slice(0, 8);
  
  // Sort by createdAt descending for New Arrivals (top 4)
  const newArrivals = [...products].sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  }).slice(0, 4);

  return (
    <main className="min-h-screen flex flex-col bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500">
      <Navbar />
      
      <div className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <Hero texts={{
          title1: t.heroTitle1,
          title2: t.heroTitle2,
          description: t.heroText,
          button1: t.shopCollection
        }} />
        
        <section className="py-12 bg-vintage-paper/50 dark:bg-vintage-dark/50 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-vintage-dark dark:text-vintage-gold transition-colors duration-500">{t.philosophyTitle}</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500">
              {t.philosophyText}
            </p>
          </div>
        </section>

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
            <div className="bg-vintage-cream dark:bg-vintage-dark pt-12 transition-colors duration-500">
                <ProductGrid products={newArrivals} title={t.newArrivals} />
            </div>
        )}

        <div id="catalog-section">
            <ProductGrid products={featuredProducts} title={t.featuredCollections} />
        </div>
        
        <div className="flex justify-center pb-12 bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500">
            <Button 
                onClick={() => router.push('/shop')} 
                variant="outline" 
                className="border-vintage-gold text-vintage-gold hover:bg-vintage-gold hover:text-white transition-all duration-300"
            >
                {t.seeAll}
            </Button>
        </div>

        {!isLoggedIn && (
            <section className="bg-vintage-rose/10 dark:bg-vintage-rose/5 py-16 transition-colors duration-500">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
                  <div className="md:w-1/2 mb-8 md:mb-0">
                    <h2 className="text-3xl font-serif font-bold text-vintage-dark dark:text-vintage-gold mb-4 transition-colors duration-500">{t.joinClubTitle}</h2>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors duration-500">{t.joinClubText}</p>
                  </div>
                  <div className="md:w-1/2 flex justify-center md:justify-end">
                     <Button 
                        onClick={() => router.push('/register')}
                        className="bg-vintage-dark text-vintage-gold hover:bg-black dark:bg-vintage-gold dark:text-vintage-dark dark:hover:bg-vintage-gold-hover transition-colors duration-300"
                     >
                       {t.signUp}
                     </Button>
                  </div>
               </div>
            </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
