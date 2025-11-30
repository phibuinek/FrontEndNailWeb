'use client';

import Link from 'next/link';
import { Search, ShoppingBag, Menu, X, Moon, Sun, Globe, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [langState, setLangState] = useState(language);
  const [isFadingLang, setIsFadingLang] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user dropdown
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const userMenuRef = useRef(null);

  // Prevent hydration mismatch and check auth
  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem('username');
    const admin = localStorage.getItem('isAdmin');
    if (user && user !== 'undefined' && user !== 'null') setUsername(user);
    if (admin) setIsAdmin(true);

    // Add event listener for storage changes (e.g. login/logout in other tabs)
    const handleStorageChange = () => {
        const user = localStorage.getItem('username');
        const admin = localStorage.getItem('isAdmin');
        if (user && user !== 'undefined' && user !== 'null') {
            setUsername(user);
        } else {
            setUsername(null);
        }
        setIsAdmin(!!admin);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for immediate UI update after login/logout within the same tab
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  // Handle language transition
  useEffect(() => {
    if (language !== langState) {
      setIsFadingLang(true);
      const timer = setTimeout(() => {
        setLangState(language);
        setIsFadingLang(false);
      }, 300); // Increased delay for smoother transition
      return () => clearTimeout(timer);
    }
  }, [language, langState]);

  const handleLanguageToggle = () => {
    setIsSwitching(true);
    toggleLanguage();
    setTimeout(() => setIsSwitching(false), 600);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username');
    setUsername(null);
    setIsAdmin(false);
    setIsUserMenuOpen(false);
    window.dispatchEvent(new Event('auth-change')); // Notify other components
    router.push('/login');
  };

  const navText = {
    EN: { home: "Home", shop: "Shop", about: "Our Story", contact: "Contact", logout: "Logout", dashboard: "Dashboard", welcome: "Hi," },
    VI: { home: "Trang Chủ", shop: "Cửa Hàng", about: "Câu Chuyện", contact: "Liên Hệ", logout: "Đăng Xuất", dashboard: "Quản Lý", welcome: "Chào," }
  };

  const t = navText[langState];

  return (
    <nav className="sticky top-0 z-50 bg-vintage-cream/95 dark:bg-vintage-dark/95 backdrop-blur-sm border-b border-vintage-border dark:border-vintage-border/20 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-3xl font-bold text-vintage-brown dark:text-vintage-gold tracking-tighter transition-colors duration-500">
              Pham's nail supplies
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-8 transition-opacity duration-300 ${isFadingLang ? 'opacity-50' : 'opacity-100'}`}>
            <Link href="/" className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors duration-300 font-medium">
              {t.home}
            </Link>
            <Link href="/shop" className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors duration-300 font-medium">
              {t.shop}
            </Link>
            <Link href="/about" className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors duration-300 font-medium">
              {t.about}
            </Link>
            <Link href="/contact" className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors duration-300 font-medium">
              {t.contact}
            </Link>
          </div>

          {/* Icons & Toggles */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Toggle */}
            <button 
              onClick={handleLanguageToggle}
              className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-all duration-300 flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full hover:bg-vintage-paper/50 dark:hover:bg-vintage-cream/10"
            >
              <Globe className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isSwitching ? 'rotate-180' : ''}`} />
              
              {/* Sliding Text Container */}
              <div className="relative h-5 w-5 overflow-hidden">
                <div 
                  className={`flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    language === 'VI' ? '-translate-y-5' : 'translate-y-0'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center">EN</span>
                  <span className="flex h-5 w-5 items-center justify-center">VI</span>
                </div>
              </div>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-all duration-300 transform active:rotate-90"
              aria-label="Toggle Dark Mode"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300">
              <Search className="w-5 h-5" />
            </button>
            
            <Link href="/cart" className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300 relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-vintage-rose text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Icon / Dropdown */}
            <div 
                className="relative" 
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
                ref={userMenuRef}
            >
              {username ? (
                 <div className="flex items-center cursor-pointer text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300">
                   <User className="w-5 h-5" />
                 </div>
              ) : (
                <Link href="/login" className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300">
                   <User className="w-5 h-5" />
                </Link>
              )}

              {/* Dropdown Menu */}
              {username && isUserMenuOpen && (
                  <div className="absolute right-0 mt-0 w-48 bg-white dark:bg-vintage-dark border border-vintage-border dark:border-vintage-border/20 shadow-lg rounded-md overflow-hidden py-1 z-50 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-vintage-border dark:border-vintage-border/20 bg-vintage-paper/30 dark:bg-vintage-dark/30">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t.welcome}</p>
                          <p className="text-sm font-medium text-vintage-dark dark:text-vintage-cream truncate">{username}</p>
                      </div>
                      
                      {isAdmin && (
                          <Link 
                            href="/admin/dashboard" 
                            className="block px-4 py-2 text-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-paper dark:hover:bg-vintage-border/20 flex items-center gap-2"
                          >
                              <LayoutDashboard className="w-4 h-4" />
                              {t.dashboard}
                          </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 cursor-pointer"
                      >
                          <LogOut className="w-4 h-4" />
                          {t.logout}
                      </button>
                  </div>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             {/* Mobile Theme Toggle */}
             <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300"
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-vintage-paper dark:bg-vintage-dark border-b border-vintage-border dark:border-vintage-border/20 transition-colors duration-500">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 transition-opacity duration-300 ${isFadingLang ? 'opacity-50' : 'opacity-100'}`}>
            <Link href="/" className="block px-3 py-2 text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold font-medium">
               {t.home}
            </Link>
            <Link href="/shop" className="block px-3 py-2 text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold font-medium">
               {t.shop}
            </Link>
            <Link href="/about" className="block px-3 py-2 text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold font-medium">
               {t.about}
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold font-medium">
               {t.contact}
            </Link>
            
            <button 
              onClick={handleLanguageToggle}
              className="w-full text-left block px-3 py-2 text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold font-medium flex items-center gap-2"
            >
              <Globe className={`w-4 h-4 transition-transform duration-500 ${isSwitching ? 'rotate-180' : ''}`} />
              <span>Switch to {langState === 'EN' ? 'Vietnamese' : 'English'}</span>
            </button>

            {/* Mobile User Menu */}
             {username ? (
                <div className="border-t border-vintage-border/30 pt-2 mt-2">
                    <div className="px-3 py-2 text-xs text-gray-500">{t.welcome} {username}</div>
                    {isAdmin && (
                        <Link href="/admin/dashboard" className="block px-3 py-2 text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold font-medium flex items-center gap-2">
                             <LayoutDashboard className="w-4 h-4" /> {t.dashboard}
                        </Link>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left block px-3 py-2 text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> {t.logout}
                    </button>
                </div>
             ) : (
                 <Link href="/login" className="block px-3 py-2 text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold font-medium flex items-center gap-2">
                   <User className="w-4 h-4" /> Login
                 </Link>
             )}

          </div>
        </div>
      )}
    </nav>
  );
}
