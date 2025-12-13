import { Playfair_Display, Lato } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import ReduxProvider from "@/components/ReduxProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Pham's Nail Supplies",
  description: "Premium Vintage Nail Supplies for Professionals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-vintage-cream text-vintage-dark dark:bg-vintage-dark dark:text-vintage-cream transition-colors duration-300`}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var htmlEl = document.documentElement;
                  var theme = null;
                  
                  // Try to get theme from localStorage
                  try {
                    theme = localStorage.getItem('pham-nail-theme');
                  } catch (e) {
                    // localStorage might be blocked or unavailable
                    console.warn('localStorage not available for theme');
                  }
                  
                  // Check system preference
                  var systemDark = false;
                  try {
                    systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  } catch (e) {
                    // matchMedia might not be available
                  }
                  
                  // Apply theme
                  if (theme === 'dark' || (theme === 'system' && systemDark) || (!theme && systemDark)) {
                    htmlEl.classList.add('dark');
                  } else {
                    htmlEl.classList.remove('dark');
                  }
                } catch (e) {
                  // Ultimate fallback - default to light
                  try {
                    document.documentElement.classList.remove('dark');
                  } catch (err) {
                    // If even this fails, do nothing
                  }
                }
              })();
            `,
          }}
        />
        <ReduxProvider>
          <SmoothScrollProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="pham-nail-theme"
            >
              <LanguageProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </LanguageProvider>
            </ThemeProvider>
          </SmoothScrollProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
