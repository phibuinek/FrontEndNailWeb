'use client';

import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, Lock, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const translations = {
  EN: {
    title: "Your Shopping Cart",
    empty: "Your cart is currently empty.",
    continue: "Continue Shopping",
    item: "Item",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    subtotal: "Subtotal",
    checkout: "Proceed to Checkout",
    loginToCheckout: "Login to Checkout"
  },
  VI: {
    title: "Giỏ Hàng Của Bạn",
    empty: "Giỏ hàng của bạn đang trống.",
    continue: "Tiếp Tục Mua Sắm",
    item: "Sản Phẩm",
    price: "Giá",
    quantity: "Số Lượng",
    total: "Tổng Cộng",
    subtotal: "Tạm Tính",
    checkout: "Tiến Hành Thanh Toán",
    loginToCheckout: "Đăng Nhập Để Thanh Toán"
  }
};

export default function CartView() {
  const { language } = useLanguage();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const t = translations[language];
  const langKey = language.toLowerCase();
  const router = useRouter();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (isLoggedIn) {
        router.push('/checkout');
    } else {
        router.push('/login');
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500">
      <Navbar />
      
      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-vintage-dark dark:text-vintage-gold mb-8 transition-colors duration-500">{t.title}</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-vintage-dark/50 border border-vintage-border dark:border-vintage-border/20 shadow-sm rounded-xl transition-colors duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-vintage-gold/10 rounded-full mb-6">
                <ShoppingBag className="w-10 h-10 text-vintage-gold/50" />
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-500 font-medium">{t.empty}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">{language === 'VI' ? 'Hãy thêm sản phẩm vào giỏ hàng của bạn' : 'Add items to your cart to get started'}</p>
              <Button variant="outline" onClick={() => router.push('/shop')} className="px-8">
                {t.continue}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Cart Items */}
               <div className="lg:col-span-8">
                  <div className="bg-white dark:bg-vintage-dark/50 border border-vintage-border dark:border-vintage-border/20 shadow-sm overflow-hidden">
                    <ul className="divide-y divide-vintage-border dark:divide-vintage-border/20">
                      {cart.map((item) => {
                        const name = typeof item.name === 'object' ? item.name[langKey] : item.name;
                        const category = typeof item.category === 'object' ? item.category[langKey] : item.category;
                        
                        return (
                          <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex-shrink-0 w-24 h-24 relative bg-gray-100 rounded-md overflow-hidden border border-vintage-border">
                               {item.image ? (
                                 <Image src={item.image} alt={name} fill className="object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                               )}
                            </div>
                            
                            <div className="flex-grow text-center sm:text-left">
                              <h3 className="text-lg font-serif font-medium text-vintage-dark dark:text-vintage-cream">
                                <a href={`/product/${item.id}`} className="cursor-pointer hover:text-vintage-gold transition-colors">{name}</a>
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category}</p>
                              <p className="text-sm font-medium text-vintage-gold mt-2 sm:hidden">${item.price}</p>
                            </div>

                            <div className="flex items-center gap-4">
                               <div className="flex items-center border border-vintage-border rounded-sm">
                                 <button 
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="p-2 hover:bg-vintage-paper dark:hover:bg-vintage-border/20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                    disabled={item.quantity <= 1}
                                 >
                                   <Minus className="w-3 h-3 text-vintage-dark dark:text-vintage-cream" />
                                 </button>
                                 <span className="w-8 text-center text-sm font-medium text-vintage-dark dark:text-vintage-cream">{item.quantity}</span>
                                 <button 
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="p-2 hover:bg-vintage-paper dark:hover:bg-vintage-border/20 transition-colors cursor-pointer"
                                 >
                                   <Plus className="w-3 h-3 text-vintage-dark dark:text-vintage-cream" />
                                 </button>
                               </div>
                               
                               <p className="text-lg font-medium text-vintage-dark dark:text-vintage-cream hidden sm:block w-20 text-right">
                                 ${(item.price * item.quantity).toFixed(2)}
                               </p>

                               <button 
                                 onClick={() => removeFromCart(item.id)}
                                 className="text-gray-400 hover:text-vintage-rose transition-colors cursor-pointer"
                               >
                                 <Trash2 className="w-5 h-5" />
                               </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
               </div>

               {/* Order Summary */}
               <div className="lg:col-span-4">
                  <div className="bg-white dark:bg-vintage-dark/50 border border-vintage-border dark:border-vintage-border/20 shadow-sm p-6">
                    <h2 className="text-lg font-serif font-bold text-vintage-dark dark:text-vintage-cream mb-6">{t.total}</h2>
                    
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t.subtotal}</span>
                      <span className="font-medium text-vintage-dark dark:text-vintage-cream">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-vintage-border dark:border-vintage-border/20 pt-4 mt-4">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-base font-bold text-vintage-dark dark:text-vintage-cream">{t.total}</span>
                        <span className="text-xl font-bold text-vintage-gold">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <Button 
                        className={`w-full py-3 text-lg ${!isLoggedIn ? 'opacity-90' : ''}`}
                        onClick={handleCheckout}
                      >
                         {isLoggedIn ? t.checkout : (
                             <span className="flex items-center gap-2 justify-center">
                                 <Lock className="w-4 h-4" /> {t.loginToCheckout}
                             </span>
                         )}
                      </Button>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
