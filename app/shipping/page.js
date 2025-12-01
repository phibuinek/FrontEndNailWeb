'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    title: "Shipping & Returns",
    shippingPolicy: "Shipping Policy",
    shippingText: "We ship worldwide. Orders are typically processed within 1-2 business days. Shipping times vary by location but generally range from 3-7 business days for domestic orders and 7-14 business days for international orders.",
    returnPolicy: "Return Policy",
    returnText: "We want you to love your purchase. If you are not completely satisfied, you may return unopened and unused items within 30 days of purchase for a full refund. Please contact our support team to initiate a return."
  },
  VI: {
    title: "Vận Chuyển & Đổi Trả",
    shippingPolicy: "Chính Sách Vận Chuyển",
    shippingText: "Chúng tôi giao hàng trên toàn thế giới. Đơn hàng thường được xử lý trong vòng 1-2 ngày làm việc. Thời gian giao hàng thay đổi tùy theo địa điểm nhưng thường từ 3-7 ngày làm việc đối với đơn hàng trong nước và 7-14 ngày làm việc đối với đơn hàng quốc tế.",
    returnPolicy: "Chính Sách Đổi Trả",
    returnText: "Chúng tôi muốn bạn hài lòng với giao dịch mua hàng của mình. Nếu bạn không hoàn toàn hài lòng, bạn có thể trả lại các mặt hàng chưa mở và chưa sử dụng trong vòng 30 ngày kể từ ngày mua để được hoàn lại tiền đầy đủ. Vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi để bắt đầu quy trình đổi trả."
  }
};

export default function ShippingPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold text-vintage-brown dark:text-vintage-gold mb-8">{t.title}</h1>
        <div className="prose dark:prose-invert max-w-none text-vintage-dark dark:text-vintage-cream/80">
          <h3>{t.shippingPolicy}</h3>
          <p>{t.shippingText}</p>
          
          <h3 className="mt-8">{t.returnPolicy}</h3>
          <p>{t.returnText}</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
