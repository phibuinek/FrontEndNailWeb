'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    title: "Privacy Policy",
    intro: "Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.",
    collectTitle: "Information We Collect",
    collectText: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, shipping address, and payment information.",
    useTitle: "How We Use Your Information",
    useText: "We use your information to process your orders, communicate with you, and improve our services. We do not sell your personal data to third parties."
  },
  VI: {
    title: "Chính Sách Bảo Mật",
    intro: "Quyền riêng tư của bạn rất quan trọng đối với chúng tôi. Chính sách Bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
    collectTitle: "Thông Tin Chúng Tôi Thu Thập",
    collectText: "Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi, chẳng hạn như khi bạn tạo tài khoản, mua hàng hoặc liên hệ với chúng tôi để được hỗ trợ. Thông tin này có thể bao gồm tên, địa chỉ email, địa chỉ giao hàng và thông tin thanh toán của bạn.",
    useTitle: "Cách Chúng Tôi Sử Dụng Thông Tin Của Bạn",
    useText: "Chúng tôi sử dụng thông tin của bạn để xử lý đơn hàng, liên lạc với bạn và cải thiện dịch vụ của chúng tôi. Chúng tôi không bán dữ liệu cá nhân của bạn cho bên thứ ba."
  }
};

export default function PrivacyPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold text-vintage-brown dark:text-vintage-gold mb-8">{t.title}</h1>
        <div className="prose dark:prose-invert max-w-none text-vintage-dark dark:text-vintage-cream/80">
          <p>{t.intro}</p>
          <h3 className="mt-6 text-xl font-bold">{t.collectTitle}</h3>
          <p>{t.collectText}</p>
          <h3 className="mt-6 text-xl font-bold">{t.useTitle}</h3>
          <p>{t.useText}</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
