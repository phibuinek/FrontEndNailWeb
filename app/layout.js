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
                  
                  // CRITICAL: Force remove dark class FIRST, before any other logic
                  htmlEl.classList.remove('dark');
                  
                  var theme = null;
                  
                  // Try to get theme from localStorage
                  try {
                    theme = localStorage.getItem('pham-nail-theme');
                    
                    // If theme is 'system', null, empty, or invalid, force set to 'light'
                    if (!theme || theme === 'system' || theme === '' || (theme !== 'light' && theme !== 'dark')) {
                      theme = 'light';
                      localStorage.setItem('pham-nail-theme', 'light');
                    }
                  } catch (e) {
                    // localStorage might be blocked or unavailable
                    console.warn('localStorage not available for theme');
                    theme = 'light'; // Default to light
                  }
                  
                  // Apply theme - ONLY add dark if explicitly 'dark', otherwise force light
                  if (theme === 'dark') {
                    htmlEl.classList.add('dark');
                  } else {
                    // Force remove dark class for light mode
                    htmlEl.classList.remove('dark');
                  }
                  
                  // Triple check - ensure light mode is applied if not dark
                  if (theme !== 'dark') {
                    htmlEl.classList.remove('dark');
                    // Also set attribute to ensure consistency
                    htmlEl.removeAttribute('data-theme');
                  }
                  
                  // Set a flag to prevent next-themes from overriding
                  htmlEl.setAttribute('data-theme-initialized', 'true');
                } catch (e) {
                  // Ultimate fallback - default to light
                  try {
                    var htmlEl = document.documentElement;
                    htmlEl.classList.remove('dark');
                    htmlEl.removeAttribute('data-theme');
                    htmlEl.setAttribute('data-theme-initialized', 'true');
                  } catch (err) {
                    // If even this fails, do nothing
                  }
                }
              })();
            `,
          }}
        />
        <Script
          id="theme-enforcer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Run after page loads to ensure theme is correct
                function enforceLightMode() {
                  try {
                    var htmlEl = document.documentElement;
                    var theme = localStorage.getItem('pham-nail-theme');
                    
                    // If not explicitly 'dark', force light mode
                    if (theme !== 'dark') {
                      htmlEl.classList.remove('dark');
                      if (!theme || theme === 'system') {
                        localStorage.setItem('pham-nail-theme', 'light');
                      }
                    }
                  } catch (e) {
                    // Ignore errors
                  }
                }
                
                // Run immediately
                enforceLightMode();
                
                // Run after a short delay to catch any late theme changes
                setTimeout(enforceLightMode, 100);
                setTimeout(enforceLightMode, 500);
                
                // Also listen for storage changes
                window.addEventListener('storage', function(e) {
                  if (e.key === 'pham-nail-theme') {
                    enforceLightMode();
                  }
                });
              })();
            `,
          }}
        />
        <ReduxProvider>
          <SmoothScrollProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
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
