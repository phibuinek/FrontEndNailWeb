'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    subtotal: "Subtotal",
    shipping: "Shipping",
    shippingCalculated: "Calculated at next step",
    total: "Total",
    giftCardPlaceholder: "Gift card or discount code",
    apply: "Apply"
  },
  VI: {
    subtotal: "Tạm tính",
    shipping: "Vận chuyển",
    shippingCalculated: "Tính ở bước tiếp theo",
    total: "Tổng cộng",
    giftCardPlaceholder: "Thẻ quà tặng hoặc mã giảm giá",
    apply: "Áp dụng"
  }
};

export default function CheckoutOrderSummary() {
  const { cart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  const langKey = language.toLowerCase();
  
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // Calculated later or fixed
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 dark:bg-vintage-dark/30 p-6 rounded-lg lg:h-full">
      <div className="space-y-4 mb-6">
        {cart.map((item) => {
            const name = typeof item.name === 'object' ? item.name[langKey] : item.name;
            const category = typeof item.category === 'object' ? item.category[langKey] : item.category;

            return (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-white flex-shrink-0">
                   {item.image ? (
                     <Image 
                       src={item.image} 
                       alt={name} 
                       fill 
                       className="object-cover" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                   )}
                   <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-bl-md">
                     {item.quantity}
                   </span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-vintage-cream">
                    {name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category}
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-vintage-cream">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
        })}
      </div>

      <div className="flex gap-2 mb-6">
        <div className="flex-grow relative">
            <input 
                type="text" 
                placeholder={t.giftCardPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-vintage-gold text-sm bg-white dark:bg-vintage-dark/50"
            />
        </div>
        <Button variant="outline" className="whitespace-nowrap">{t.apply}</Button>
      </div>

      <div className="space-y-3 border-t border-gray-200 dark:border-vintage-border/20 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t.subtotal}</span>
          <span className="font-medium text-gray-900 dark:text-vintage-cream">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t.shipping}</span>
          <span className="text-xs text-gray-500">{t.shippingCalculated}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 border-t border-gray-200 dark:border-vintage-border/20 pt-4">
        <span className="text-base font-bold text-gray-900 dark:text-vintage-cream">{t.total}</span>
        <div className="text-right">
            <span className="text-xs text-gray-500 mr-2">USD</span>
            <span className="text-xl font-bold text-vintage-dark dark:text-vintage-gold">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

