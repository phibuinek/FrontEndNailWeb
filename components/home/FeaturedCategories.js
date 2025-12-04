'use client';

import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function FeaturedCategories({ language = 'EN' }) {
  const router = useRouter();

  const t = language === 'VI' ? {
      title: "Danh Mục Nổi Bật",
      cat1: "Sơn Gel",
      cat2: "Móng Giả & Keo",
      cat3: "Dụng Cụ & Phụ Kiện",
      explore: "Khám Phá"
  } : {
      title: "Featured Categories",
      cat1: "Gel Polish",
      cat2: "Nail Tips & Glue",
      cat3: "Tools & Accessories",
      explore: "Explore"
  };

  // Use English keys for URL (ShopView filters by English key)
  const categoryKeys = {
    cat1: 'Gel Polish',
    cat2: 'Nail Tips & Glue',
    cat3: 'Tools & Accessories'
  };

  const categories = [
    { 
        id: 1, 
        name: t.cat1, 
        image: "/images/SonGel.jpg", 
        link: `/shop?category=${encodeURIComponent(categoryKeys.cat1)}`
    },
    { 
        id: 2, 
        name: t.cat2, 
        image: "/images/MongGia.jpg", 
        link: `/shop?category=${encodeURIComponent(categoryKeys.cat2)}`
    },
    { 
        id: 3, 
        name: t.cat3, 
        image: "/images/DungCu.jpg", 
        link: `/shop?category=${encodeURIComponent(categoryKeys.cat3)}`
    }
  ];

  return (
    <section className="py-16 bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-vintage-dark dark:text-vintage-gold mb-12 transition-colors duration-500">
          {t.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div 
                key={cat.id} 
                className="group relative h-96 rounded-lg overflow-hidden cursor-pointer shadow-lg vintage-shadow"
                onClick={() => router.push(cat.link)}
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <Image 
                    src={cat.image} 
                    alt={cat.name}
                    fill
                    quality={100}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={true}
                />
              </div>
              
              {/* Gradient Overlay for readability - Reduced opacity for clearer image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-50 transition-opacity duration-300" />

              {/* Vintage Noise Texture Overlay - Reduced for clarity */}
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-serif font-bold text-vintage-cream mb-3 drop-shadow-md">{cat.name}</h3>
                <div className="w-12 h-0.5 bg-vintage-gold mb-4 group-hover:w-full transition-all duration-500" />
                <div className="flex items-center gap-2 text-vintage-gold text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <span>{t.explore}</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

