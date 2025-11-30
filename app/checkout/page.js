'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Fallback key for development if env var is missing
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing in environment variables');
}
const stripePromise = loadStripe(stripeKey);

const translations = {
  EN: {
    cart: "Cart",
    info: "Information",
    shipping: "Shipping",
    payment: "Payment",
    refund: "Refund policy",
    shippingPolicy: "Shipping policy",
    privacy: "Privacy policy",
    terms: "Terms of service"
  },
  VI: {
    cart: "Giỏ Hàng",
    info: "Thông Tin",
    shipping: "Vận Chuyển",
    payment: "Thanh Toán",
    refund: "Chính sách hoàn tiền",
    shippingPolicy: "Chính sách vận chuyển",
    privacy: "Chính sách bảo mật",
    terms: "Điều khoản dịch vụ"
  }
};

export default function CheckoutPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  const appearance = {
    theme: 'flat', // Use flat theme for better transparency control
    variables: {
      colorPrimary: '#C19A6B',
      colorBackground: 'transparent',
      colorText: mounted && resolvedTheme === 'dark' ? '#FDFBF7' : '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Lato, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
    rules: {
        '.Input': {
            backgroundColor: 'transparent',
            borderColor: mounted && resolvedTheme === 'dark' ? '#4b5563' : '#d1d5db',
            boxShadow: 'none',
            color: mounted && resolvedTheme === 'dark' ? '#FDFBF7' : '#30313d',
        }
    }
  };

  const options = {
    appearance,
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-vintage-dark text-gray-900 dark:text-vintage-cream transition-colors duration-500">
      
      {/* Left Column - Main Content */}
      <div className="lg:w-3/5 w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12 order-2 lg:order-1">
        <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-none lg:mr-8">
            <div className="mb-8">
                <Link href="/" className="text-2xl font-serif font-bold text-vintage-brown dark:text-vintage-gold tracking-tighter">
                  Pham's nail supplies
                </Link>
                <div className="text-sm text-gray-500 mt-2 flex gap-2">
                    <span>{t.cart}</span> <span>&gt;</span> <span className="font-medium text-gray-900 dark:text-vintage-cream">{t.info}</span> <span>&gt;</span> <span>{t.shipping}</span> <span>&gt;</span> <span>{t.payment}</span>
                </div>
            </div>

            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm />
            </Elements>

            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-vintage-border/20 flex flex-wrap gap-4 text-xs text-blue-600 underline">
                <a href="#">{t.refund}</a>
                <a href="#">{t.shippingPolicy}</a>
                <a href="#">{t.privacy}</a>
                <a href="#">{t.terms}</a>
            </div>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:w-2/5 w-full bg-gray-50 dark:bg-vintage-dark/30 border-l border-gray-200 dark:border-vintage-border/20 order-1 lg:order-2">
         <div className="p-4 sm:p-8 lg:p-12 max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
            <CheckoutOrderSummary />
         </div>
      </div>
    </main>
  );
}
