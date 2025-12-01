'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Star, Package } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

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

  // Fallback for quantity if not present in legacy data
  const quantity = product.quantity !== undefined ? product.quantity : 0;
  const sold = product.sold !== undefined ? product.sold : 0;
  const isOutOfStock = quantity === 0;

  return (
    <div className="group relative bg-white dark:bg-vintage-dark border border-vintage-border dark:border-vintage-border/20 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 lg:aspect-none lg:h-60 relative">
        {/* Placeholder image logic - use Next.js Image if available, else fallback */}
        {product.image ? (
             <div className="h-full w-full relative">
                <Image 
                    src={product.image}
                    alt={name}
                    fill
                    className="object-cover object-center"
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
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-sm font-serif font-bold text-lg text-vintage-dark dark:text-vintage-cream">
            <Link href={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
             <p className="text-sm text-vintage-gold font-medium flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" /> {product.rating}
              <span className="text-gray-400 text-xs ml-1">({sold} {t.sold})</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Package className="w-3 h-3" /> {quantity} {t.left}
            </p>
          </div>
          
          <div className="flex justify-between items-end">
            <p className="text-lg font-medium text-vintage-dark dark:text-vintage-cream">${product.price}</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="z-10 relative disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isOutOfStock}
              onClick={() => addToCart(product)}
            >
              {isOutOfStock ? t.soldOut : t.add}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
