'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    title: "Contact Us",
    intro: "Have questions about our products or need professional advice? We're here to help.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send Message",
    infoTitle: "Get in Touch",
    address: "123 Vintage Lane, Artistry District",
    phone: "+1 (555) 123-4567",
    emailText: "hello@vintagenailsupply.com"
  },
  VI: {
    title: "Liên Hệ",
    intro: "Bạn có câu hỏi về sản phẩm hoặc cần tư vấn chuyên môn? Chúng tôi ở đây để giúp đỡ.",
    name: "Tên",
    email: "Email",
    message: "Tin Nhắn",
    send: "Gửi Tin Nhắn",
    infoTitle: "Thông Tin Liên Lạc",
    address: "123 Đường Vintage, Quận Nghệ Thuật",
    phone: "+84 (555) 123-4567",
    emailText: "hello@vintagenailsupply.com"
  }
};

export default function ContactView() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen flex flex-col bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500">
      <Navbar />
      
      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-vintage-dark dark:text-vintage-gold mb-4 transition-colors duration-500">{t.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-500">{t.intro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-vintage-dark/50 p-8 border border-vintage-border dark:border-vintage-border/20 shadow-sm transition-colors duration-500">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-vintage-brown dark:text-vintage-cream transition-colors duration-300">{t.name}</label>
                  <input type="text" id="name" className="mt-1 block w-full border-gray-300 shadow-sm focus:border-vintage-gold focus:ring-vintage-gold sm:text-sm p-2 border bg-vintage-paper dark:bg-vintage-dark dark:text-white dark:border-vintage-border/20" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-vintage-brown dark:text-vintage-cream transition-colors duration-300">{t.email}</label>
                  <input type="email" id="email" className="mt-1 block w-full border-gray-300 shadow-sm focus:border-vintage-gold focus:ring-vintage-gold sm:text-sm p-2 border bg-vintage-paper dark:bg-vintage-dark dark:text-white dark:border-vintage-border/20" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-vintage-brown dark:text-vintage-cream transition-colors duration-300">{t.message}</label>
                  <textarea id="message" rows="4" className="mt-1 block w-full border-gray-300 shadow-sm focus:border-vintage-gold focus:ring-vintage-gold sm:text-sm p-2 border bg-vintage-paper dark:bg-vintage-dark dark:text-white dark:border-vintage-border/20"></textarea>
                </div>
                <Button type="submit" className="w-full">{t.send}</Button>
              </form>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h3 className="text-xl font-serif font-bold text-vintage-dark dark:text-vintage-gold mb-2 transition-colors duration-500">{t.infoTitle}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-500">{t.address}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-500">{t.phone}</p>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">{t.emailText}</p>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-48 bg-vintage-paper dark:bg-vintage-dark/30 border border-vintage-border dark:border-vintage-border/20 flex items-center justify-center text-vintage-brown/50 dark:text-vintage-cream/30 transition-colors duration-500">
                 Google Maps Placeholder
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

