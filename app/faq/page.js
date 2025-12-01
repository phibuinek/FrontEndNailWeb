'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    title: "Frequently Asked Questions",
    q1: "Do you ship internationally?",
    a1: "Yes, we ship to most countries worldwide. Shipping costs will be calculated at checkout.",
    q2: "Are your products cruelty-free?",
    a2: "Absolutely! All our nail polishes and care products are 100% vegan and cruelty-free.",
    q3: "How can I track my order?",
    a3: "Once your order ships, you will receive an email with a tracking number to monitor your shipment."
  },
  VI: {
    title: "Câu Hỏi Thường Gặp",
    q1: "Bạn có giao hàng quốc tế không?",
    a1: "Có, chúng tôi giao hàng đến hầu hết các quốc gia trên thế giới. Chi phí vận chuyển sẽ được tính khi thanh toán.",
    q2: "Sản phẩm của bạn có không thử nghiệm trên động vật không?",
    a2: "Chắc chắn rồi! Tất cả các sản phẩm sơn móng tay và chăm sóc móng của chúng tôi đều 100% thuần chay và không thử nghiệm trên động vật.",
    q3: "Làm thế nào để tôi theo dõi đơn hàng của mình?",
    a3: "Khi đơn hàng của bạn được gửi đi, bạn sẽ nhận được email có số theo dõi để giám sát lô hàng của mình."
  }
};

export default function FAQPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold text-vintage-brown dark:text-vintage-gold mb-8">{t.title}</h1>
        <div className="space-y-6 text-vintage-dark dark:text-vintage-cream/80">
          <div>
            <h3 className="text-xl font-bold mb-2">{t.q1}</h3>
            <p>{t.a1}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{t.q2}</h3>
            <p>{t.a2}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{t.q3}</h3>
            <p>{t.a3}</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
