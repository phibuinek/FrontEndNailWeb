'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Star, Package, Feather } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

export default function ProductCard({ product }) {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const langKey = language.toLowerCase(); // 'en' or 'vi'

  const translations = {
    EN: {
      add: "Add",
      soldOut: "Sold Out",
      outOfStock: "OUT OF STOCK",
      left: "left",
      sold: "sold"
    },
    VI: {
      add: "Thêm",
      soldOut: "Hết Hàng",
      outOfStock: "HẾT HÀNG",
      left: "còn lại",
      sold: "đã bán"
    }
  };

  const t = translations[language];

  // Handle bilingual data or fallback to legacy string format
  const name = typeof product.name === 'object' ? product.name[langKey] : product.name;
  const description = typeof product.description === 'object' ? product.description[langKey] : product.description;
  const categoryLabel = typeof product.category === 'object' ? product.category[langKey] : product.category;

  // Fallback for quantity if not present in legacy data
  const quantity = product.quantity !== undefined ? product.quantity : 0;
  const sold = product.sold !== undefined ? product.sold : 0;
  const discount = product.discount || 0;
  const isOutOfStock = quantity === 0;
  const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') : false;

  // Calculate discounted price
  const discountedPrice = discount > 0
    ? product.price * (1 - discount / 100)
    : product.price;
  const ratingValue = product.rating ?? 4.8;

  return (
    <div className="group relative bg-white dark:bg-vintage-dark/70 border border-vintage-border/50 dark:border-vintage-border/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-vintage-gold/10 via-transparent to-pink-200/20 dark:from-vintage-gold/20" />
      <Link href={`/product/${product.id}`} className="block h-full w-full">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-vintage-paper/70 dark:bg-vintage-dark/40 lg:aspect-none lg:h-60 relative">
          {/* Sale Badge */}
          {discount > 0 && !isOutOfStock && (
              <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm tracking-wider">
                  -{discount}%
              </div>
          )}

          {/* Vintage frame */}
          <div className="absolute inset-4 border border-white/70 dark:border-white/10 rounded-[22px] opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

          {/* Placeholder image logic - use Next.js Image if available, else fallback */}
          {product.image ? (
               <div className="h-full w-full relative">
                  <Image 
                      src={product.image}
                      alt={name}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                   {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                      <span className="text-white font-bold px-3 py-1 border border-white">{t.outOfStock}</span>
                    </div>
                  )}
               </div>
          ) : (
              <div className="h-full w-full bg-vintage-paper dark:bg-vintage-dark/50 flex items-center justify-center text-vintage-brown/50 dark:text-vintage-cream/30">
              Product Image
              </div>
          )}
         
        </div>
      </Link>
      <div className="p-5 flex flex-col gap-4 flex-grow relative">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400">
          <span>{categoryLabel}</span>
          <span className="flex items-center gap-1 text-vintage-gold">
            <Feather className="w-3 h-3" /> Atelier
          </span>
        </div>

        <div className="space-y-2 flex-1">
          <h3 className="text-lg font-serif font-semibold text-vintage-dark dark:text-vintage-cream line-clamp-1">
            <Link href={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <p className="text-vintage-gold font-medium flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" /> {Number(ratingValue).toFixed(1)}
              <span className="text-gray-400 ml-1">({sold} {t.sold})</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Package className="w-3 h-3" /> {quantity} {t.left}
            </p>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col">
                {discount > 0 && (
                    <span className="text-xs text-gray-500 line-through mb-0.5">
                        {formatPrice(product.price, language)}
                    </span>
                )}
                <p className={`text-lg font-medium ${discount > 0 ? 'text-red-600' : 'text-vintage-dark dark:text-vintage-cream'}`}>
                    {formatPrice(discountedPrice, language)}
                </p>
            </div>
            
            {!isAdmin && (
                <Button 
                  size="sm"   
                  variant="outline" 
                  className="z-10 relative disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-vintage-gold group-hover:text-white transition-all"
                  disabled={isOutOfStock}
                  onClick={() => addToCart({ ...product, price: discountedPrice })}
                >
                  {isOutOfStock ? t.soldOut : t.add}
                </Button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-1 left-6 text-xs uppercase tracking-[0.4em] text-vintage-dark/50 dark:text-vintage-cream/60 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        View details
        <span className="w-8 h-px bg-current" />
      </div>
    </div>
  );
}
