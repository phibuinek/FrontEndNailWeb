'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    title: "Terms of Service",
    intro: "By accessing or using our website, you agree to be bound by these Terms of Service.",
    useTitle: "Use of Our Service",
    useText: "You must be at least 18 years old to use our services. You agree not to use our products for any illegal or unauthorized purpose.",
    accuracyTitle: "Product Accuracy",
    accuracyText: "We try to be as accurate as possible with our product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free."
  },
  VI: {
    title: "Điều Khoản Dịch Vụ",
    intro: "Bằng cách truy cập hoặc sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ các Điều khoản Dịch vụ này.",
    useTitle: "Sử Dụng Dịch Vụ Của Chúng Tôi",
    useText: "Bạn phải đủ 18 tuổi để sử dụng dịch vụ của chúng tôi. Bạn đồng ý không sử dụng sản phẩm của chúng tôi cho bất kỳ mục đích bất hợp pháp hoặc trái phép nào.",
    accuracyTitle: "Tính Chính Xác Của Sản Phẩm",
    accuracyText: "Chúng tôi cố gắng chính xác nhất có thể với các mô tả và hình ảnh sản phẩm của mình. Tuy nhiên, chúng tôi không đảm bảo rằng mô tả sản phẩm hoặc nội dung khác là chính xác, đầy đủ, đáng tin cậy, hiện hành hoặc không có lỗi."
  }
};

export default function TermsPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold text-vintage-brown dark:text-vintage-gold mb-8">{t.title}</h1>
        <div className="prose dark:prose-invert max-w-none text-vintage-dark dark:text-vintage-cream/80">
          <p>{t.intro}</p>
          <h3 className="mt-6 text-xl font-bold">{t.useTitle}</h3>
          <p>{t.useText}</p>
          <h3 className="mt-6 text-xl font-bold">{t.accuracyTitle}</h3>
          <p>{t.accuracyText}</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
