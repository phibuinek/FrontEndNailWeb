'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    title: "Refund Policy",
    intro: "We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.",
    eligibilityTitle: "Eligibility",
    eligibilityText: "To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.",
    refundsTitle: "Refunds",
    refundsText: "We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method."
  },
  VI: {
    title: "Chính Sách Hoàn Tiền",
    intro: "Chúng tôi có chính sách đổi trả trong 30 ngày, nghĩa là bạn có 30 ngày sau khi nhận được hàng để yêu cầu đổi trả.",
    eligibilityTitle: "Điều Kiện",
    eligibilityText: "Để đủ điều kiện đổi trả, mặt hàng của bạn phải ở cùng tình trạng như khi bạn nhận được, chưa mặc hoặc chưa sử dụng, còn nguyên tem mác và trong bao bì gốc.",
    refundsTitle: "Hoàn Tiền",
    refundsText: "Chúng tôi sẽ thông báo cho bạn sau khi nhận và kiểm tra hàng trả lại của bạn và cho bạn biết khoản hoàn tiền có được chấp thuận hay không. Nếu được chấp thuận, bạn sẽ được hoàn tiền tự động vào phương thức thanh toán ban đầu."
  }
};

export default function RefundPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold text-vintage-brown dark:text-vintage-gold mb-8">{t.title}</h1>
        <div className="prose dark:prose-invert max-w-none text-vintage-dark dark:text-vintage-cream/80">
          <p>{t.intro}</p>
          <h3 className="mt-6 text-xl font-bold">{t.eligibilityTitle}</h3>
          <p>{t.eligibilityText}</p>
          <h3 className="mt-6 text-xl font-bold">{t.refundsTitle}</h3>
          <p>{t.refundsText}</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
