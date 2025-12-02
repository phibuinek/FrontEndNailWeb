'use client';

import { Button } from '../ui/Button';
import { Mail } from 'lucide-react';

export default function Newsletter({ language = 'EN' }) {
  const t = language === 'VI' ? {
      title: "Đăng Ký Nhận Tin",
      desc: "Cập nhật xu hướng nail mới nhất và nhận ưu đãi độc quyền.",
      placeholder: "Địa chỉ email của bạn",
      button: "Đăng Ký",
      spam: "Chúng tôi không spam. Bạn có thể hủy đăng ký bất cứ lúc nào."
  } : {
      title: "Join Our Newsletter",
      desc: "Stay updated with the latest nail trends and exclusive offers.",
      placeholder: "Your email address",
      button: "Subscribe",
      spam: "No spam. Unsubscribe anytime."
  };

  return (
    <section className="relative py-20 bg-vintage-dark overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-vintage-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-vintage-rose/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="w-12 h-12 text-vintage-gold mx-auto mb-6" />
        
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-vintage-cream mb-4">
            {t.title}
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {t.desc}
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
                type="email" 
                placeholder={t.placeholder} 
                className="flex-1 px-6 py-3 rounded-sm bg-white/10 border border-vintage-gold/30 text-vintage-cream placeholder-gray-400 focus:outline-none focus:border-vintage-gold focus:ring-1 focus:ring-vintage-gold transition-all"
                required
            />
            <Button type="submit" size="lg" className="bg-vintage-gold hover:bg-vintage-gold-hover text-white min-w-[140px]">
                {t.button}
            </Button>
        </form>

        <p className="mt-6 text-xs text-gray-500 uppercase tracking-wide">
            {t.spam}
        </p>
      </div>
    </section>
  );
}

