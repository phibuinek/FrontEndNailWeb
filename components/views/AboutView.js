'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    title: "Our Story",
    subtitle: "A Legacy of Beauty",
    content1: "Founded with a passion for timeless elegance, Pham's Nail Supply was born from the desire to bring the sophisticated aesthetics of the past into the modern beauty world. We believe that tools are not just functional items, but extensions of the artist's hand.",
    content2: "Our collection is painstakingly curated from artisans around the globe who still practice traditional methods of craftsmanship. From hand-forged nippers to small-batch lacquers, every item in our store tells a story.",
    missionTitle: "Our Mission",
    missionText: "To empower nail professionals with tools that inspire creativity and evoke a sense of history and luxury in every service."
  },
  VI: {
    title: "Câu Chuyện Của Chúng Tôi",
    subtitle: "Di Sản Của Vẻ Đẹp",
    content1: "Được thành lập với niềm đam mê vẻ đẹp thanh lịch vượt thời gian, Pham's Nail Supply ra đời từ mong muốn mang thẩm mỹ tinh tế của quá khứ vào thế giới làm đẹp hiện đại. Chúng tôi tin rằng dụng cụ không chỉ là vật dụng chức năng, mà là sự nối dài của đôi tay người nghệ sĩ.",
    content2: "Bộ sưu tập của chúng tôi được tuyển chọn kỹ lưỡng từ các nghệ nhân trên khắp thế giới, những người vẫn thực hành các phương pháp thủ công truyền thống. Từ kềm rèn tay đến sơn móng sản xuất lô nhỏ, mỗi món đồ trong cửa hàng của chúng tôi đều kể một câu chuyện.",
    missionTitle: "Sứ Mệnh",
    missionText: "Trao quyền cho các chuyên gia làm móng với những dụng cụ khơi gợi sự sáng tạo và mang lại cảm giác lịch sử và sang trọng trong mỗi dịch vụ."
  }
};

export default function AboutView() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen flex flex-col bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500">
      <Navbar />
      
      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-vintage-dark dark:text-vintage-gold mb-4 transition-colors duration-500">{t.title}</h1>
                <p className="text-vintage-rose font-serif italic text-xl transition-colors duration-500">{t.subtitle}</p>
            </div>
            
            <div className="prose prose-lg prose-stone dark:prose-invert mx-auto bg-vintage-paper dark:bg-vintage-dark/50 p-8 rounded-sm border border-vintage-border dark:border-vintage-border/20 shadow-sm transition-all duration-500">
                <p className="mb-6 text-vintage-dark dark:text-vintage-cream transition-colors duration-500">
                    {t.content1}
                </p>
                <p className="mb-8 text-vintage-dark dark:text-vintage-cream transition-colors duration-500">
                    {t.content2}
                </p>
                
                <h3 className="text-2xl font-serif font-bold text-vintage-brown dark:text-vintage-gold mb-4 transition-colors duration-500">{t.missionTitle}</h3>
                <p className="text-vintage-dark dark:text-vintage-cream transition-colors duration-500">
                    {t.missionText}
                </p>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

