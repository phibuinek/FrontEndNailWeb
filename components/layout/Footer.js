'use client';

import { useState } from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    brandDesc: "Curating the finest nail supplies for professionals who appreciate the timeless elegance of vintage aesthetics.",
    explore: "Explore",
    shopAll: "Shop All",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    journal: "Journal",
    support: "Support",
    shipping: "Shipping & Returns",
    faq: "FAQ",
    contact: "Contact Us",
    privacy: "Privacy Policy",
    stayConnected: "Stay Connected",
    subscribeDesc: "Subscribe to receive updates, access to exclusive deals, and more.",
    emailPlaceholder: "Your email address",
    join: "Join",
    rights: "Vintage Nails Supply. All rights reserved."
  },
  VI: {
    brandDesc: "Tuyển chọn các dụng cụ làm móng tốt nhất cho các chuyên gia yêu thích vẻ đẹp cổ điển vượt thời gian.",
    explore: "Khám phá",
    shopAll: "Tất cả sản phẩm",
    newArrivals: "Hàng mới về",
    bestSellers: "Bán chạy nhất",
    journal: "Tạp chí",
    support: "Hỗ trợ",
    shipping: "Vận chuyển & Đổi trả",
    faq: "Câu hỏi thường gặp",
    contact: "Liên hệ",
    privacy: "Chính sách bảo mật",
    stayConnected: "Kết nối với chúng tôi",
    subscribeDesc: "Đăng ký để nhận cập nhật, ưu đãi độc quyền và nhiều hơn nữa.",
    emailPlaceholder: "Địa chỉ email của bạn",
    join: "Tham gia",
    rights: "Vintage Nails Supply. Đã đăng ký bản quyền."
  }
};

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError(language === 'VI' ? 'Vui lòng nhập email' : 'Please enter your email');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(language === 'VI' ? 'Email không hợp lệ' : 'Invalid email address');
      return;
    }
    
    // TODO: Integrate with newsletter API
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-vintage-brown text-vintage-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-vintage-gold">Vintage Nails</h3>
            <p className="text-vintage-cream/80 text-sm leading-relaxed">
              {t.brandDesc}
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-vintage-gold">{t.explore}</h4>
            <ul className="space-y-2 text-sm text-vintage-cream/80">
              <li><Link href="/shop" className="hover:text-white transition-colors cursor-pointer">{t.shopAll}</Link></li>
              <li><Link href="/shop?sort=newest" className="hover:text-white transition-colors cursor-pointer">{t.newArrivals}</Link></li>
              <li><Link href="/shop?sort=bestSellers" className="hover:text-white transition-colors cursor-pointer">{t.bestSellers}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors cursor-pointer">{t.journal}</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-vintage-gold">{t.support}</h4>
            <ul className="space-y-2 text-sm text-vintage-cream/80">
              <li><Link href="/shipping" className="hover:text-white transition-colors cursor-pointer">{t.shipping}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors cursor-pointer">{t.faq}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors cursor-pointer">{t.contact}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors cursor-pointer">{t.privacy}</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-vintage-gold">{t.stayConnected}</h4>
            <p className="text-vintage-cream/80 text-sm">{t.subscribeDesc}</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder={t.emailPlaceholder}
                  className="bg-vintage-cream/10 border border-vintage-cream/20 px-4 py-2 text-sm text-white placeholder-vintage-cream/50 focus:outline-none focus:border-vintage-gold w-full rounded-sm"
                  aria-label={t.emailPlaceholder}
                />
                <button 
                  type="submit"
                  className="bg-vintage-gold text-vintage-brown px-4 py-2 text-sm font-medium hover:bg-vintage-gold-hover transition-colors rounded-sm whitespace-nowrap"
                  aria-label={t.join}
                >
                  {t.join}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-300">{error}</p>
              )}
              {subscribed && (
                <p className="text-xs text-green-300">
                  {language === 'VI' ? 'Đăng ký thành công!' : 'Successfully subscribed!'}
                </p>
              )}
            </form>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-vintage-cream/80 hover:text-vintage-gold cursor-pointer"><Instagram size={20} /></a>
              <a href="#" className="text-vintage-cream/80 hover:text-vintage-gold cursor-pointer"><Facebook size={20} /></a>
              <a href="#" className="text-vintage-cream/80 hover:text-vintage-gold cursor-pointer"><Twitter size={20} /></a>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-vintage-cream/10 text-center text-sm text-vintage-cream/60">
          <p>&copy; {new Date().getFullYear()} {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
