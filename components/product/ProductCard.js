'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Star, Package, Feather, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

export default function ProductCard({ product }) {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const langKey = language.toLowerCase(); // 'en' or 'vi'

  const translations = {
    EN: {
      add: "Add to cart",
      soldOut: "Sold Out",
      outOfStock: "OUT OF STOCK",
      left: "left",
      sold: "sold"
    },
    VI: {
      add: "Thêm vào giỏ hàng",
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
        <div className="aspect-square w-full overflow-hidden bg-vintage-paper/70 dark:bg-vintage-dark/40 relative">
          {/* Sale Badge */}
          {discount > 0 && !isOutOfStock && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm tracking-wider">
                  -{discount}%
              </div>
          )}

          {/* Vintage frame */}
          <div className="absolute inset-2 sm:inset-4 border border-white/70 dark:border-white/10 rounded-xl sm:rounded-[22px] opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

          {/* Placeholder image logic - use Next.js Image if available, else fallback */}
          {product.image ? (
               <div className="h-full w-full relative">
                  <Image 
                      src={product.image}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                  />
                   {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold px-2 py-1 sm:px-3 sm:py-1 border border-white">{t.outOfStock}</span>
                    </div>
                  )}
               </div>
          ) : (
              <div className="h-full w-full bg-vintage-paper dark:bg-vintage-dark/50 flex items-center justify-center text-vintage-brown/50 dark:text-vintage-cream/30 text-xs sm:text-sm">
              Product Image
              </div>
          )}
         
        </div>
      </Link>
      <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-3 sm:gap-4 flex-grow relative">
        <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-400">
          <span className="truncate pr-2">{categoryLabel}</span>
          <span className="flex items-center gap-1 text-vintage-gold flex-shrink-0">
            <Feather className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> <span className="hidden sm:inline">Premium</span>
          </span>
        </div>

        <div className="space-y-1.5 sm:space-y-2 flex-1">
          <h3 className="text-sm sm:text-base font-serif font-semibold text-vintage-dark dark:text-vintage-cream line-clamp-2 sm:line-clamp-2 md:line-clamp-3">
            <Link href={`/product/${product.id}`} className="cursor-pointer">
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center text-[10px] sm:text-xs">
            <p className="text-vintage-gold font-medium flex items-center gap-0.5 sm:gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /> {Number(ratingValue).toFixed(1)}
              <span className="text-gray-400 ml-0.5 sm:ml-1 hidden sm:inline">({sold} {t.sold})</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-0.5 sm:gap-1">
              <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> <span className="hidden sm:inline">{quantity} {t.left}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:gap-2.5">
            <div className="flex flex-col min-w-0">
                {discount > 0 && (
                    <span className="text-[10px] sm:text-xs text-gray-500 line-through mb-0.5">
                        {formatPrice(product.price, language)}
                    </span>
                )}
                <p className={`text-base sm:text-lg font-medium ${discount > 0 ? 'text-red-600' : 'text-vintage-dark dark:text-vintage-cream'}`}>
                    {formatPrice(discountedPrice, language)}
                </p>
            </div>
            
            {!isAdmin && (
                <button
                  disabled={isOutOfStock}
                  onClick={() => addToCart({ ...product, price: discountedPrice })}
                  className="w-full z-10 relative disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 ease-out group/btn overflow-hidden"
                >
                  <div className="relative w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-vintage-gold to-[#C5A059] hover:from-vintage-gold-hover hover:to-[#A88455] text-white rounded-lg border border-vintage-gold/30 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:scale-110" />
                      <span className="text-[11px] sm:text-xs font-serif font-medium tracking-wide uppercase">
                        {isOutOfStock ? t.soldOut : t.add}
                      </span>
                    </div>
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </button>
            )}
          </div>
        </div>
      </div>

      {/* View details overlay on image */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2 sm:gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-30 bg-white/90 dark:bg-vintage-dark/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
        <span className="text-[10px] sm:text-xs font-serif font-medium text-vintage-dark dark:text-vintage-cream tracking-wide uppercase">
          {language === 'VI' ? 'Xem chi tiết' : 'View details'}
        </span>
        <div className="w-1 h-1 rounded-full bg-vintage-gold animate-pulse" />
      </div>
    </div>
  );
}
