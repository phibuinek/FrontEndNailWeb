'use client';

import { Star, Truck, ShieldCheck, Heart } from 'lucide-react';

export default function Features({ language = 'EN' }) {
  const t = language === 'VI' ? {
      title: "Tại Sao Chọn Chúng Tôi",
      feat1: "Chất Lượng Cao Cấp",
      desc1: "Sản phẩm được tuyển chọn kỹ lưỡng cho độ bền vượt trội.",
      feat2: "Giao Hàng Nhanh",
      desc2: "Vận chuyển an toàn và nhanh chóng đến tận cửa salon.",
      feat3: "Bảo Hành Uy Tín",
      desc3: "Cam kết đổi trả dễ dàng nếu có lỗi từ nhà sản xuất.",
      feat4: "Hỗ Trợ Tận Tâm",
      desc4: "Đội ngũ chuyên gia luôn sẵn sàng tư vấn kỹ thuật 24/7."
  } : {
      title: "Why Choose Us",
      feat1: "Premium Quality",
      desc1: "Carefully curated products for superior durability.",
      feat2: "Fast Shipping",
      desc2: "Safe and quick delivery straight to your salon door.",
      feat3: "Reliable Warranty",
      desc3: "Easy returns commitment for manufacturer defects.",
      feat4: "Dedicated Support",
      desc4: "Expert team ready for technical consultation 24/7."
  };

  const features = [
    { icon: Star, title: t.feat1, desc: t.desc1 },
    { icon: Truck, title: t.feat2, desc: t.desc2 },
    { icon: ShieldCheck, title: t.feat3, desc: t.desc3 },
    { icon: Heart, title: t.feat4, desc: t.desc4 },
  ];

  return (
    <section className="py-16 bg-vintage-paper dark:bg-[#2A2422] transition-colors duration-500 border-y border-vintage-border dark:border-vintage-brown/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-vintage-dark dark:text-vintage-gold transition-colors duration-500">
                {t.title}
            </h2>
            <div className="w-24 h-1 bg-vintage-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-vintage-cream dark:bg-vintage-dark border-2 border-vintage-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className="w-8 h-8 text-vintage-gold" />
              </div>
              <h3 className="text-xl font-serif font-bold text-vintage-dark dark:text-vintage-cream mb-3 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm transition-colors">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

