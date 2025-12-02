'use client';

import Link from 'next/link';
import { Search, ShoppingBag, Menu, X, Moon, Sun, Globe, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navSearchTerm, setNavSearchTerm] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (navSearchTerm.trim()) {
          router.push(`/shop?search=${encodeURIComponent(navSearchTerm.trim())}`);
          setIsSearchOpen(false);
          setNavSearchTerm('');
      }
  };
  
  // Focus input when open
  useEffect(() => {
      if (isSearchOpen && searchInputRef.current) {
          searchInputRef.current.focus();
      }
  }, [isSearchOpen]);

    // Prevent hydration mismatch and check auth
    useEffect(() => {
        setMounted(true);
        
        const updateAuthState = () => {
            const user = localStorage.getItem('username');
            const admin = localStorage.getItem('isAdmin');
            
            // Only set username if it's valid string and not 'null'/'undefined'
            // Also check if access_token exists, otherwise logout/clear state
            const token = localStorage.getItem('access_token');
            
            if (token && user && user !== 'null' && user !== 'undefined') {
                setUsername(user);
            } else {
                setUsername(null);
            }
            
            setIsAdmin(!!admin);
        };

        // Initial check
        updateAuthState();

        // Add event listener for storage changes (e.g. login/logout in other tabs)
        const handleStorageChange = () => updateAuthState();

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
      }, 100); // Decreased delay for snappier transition
      return () => clearTimeout(timer);
    }
  }, [language, langState]);

  const handleLanguageToggle = () => {
    setIsSwitching(true);
    toggleLanguage();
    setTimeout(() => setIsSwitching(false), 600);
  };

  const handleLogout = () => {
    // Dispatch Redux logout action (which also clears localStorage)
    dispatch(logout());
    
    // Redundant clear for safety and immediate local state update
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
    EN: { home: "Home", shop: "Shop", about: "Our Story", contact: "Contact", logout: "Logout", dashboard: "Dashboard", welcome: "Hi,", login: "Login" },
    VI: { home: "Trang Chủ", shop: "Cửa Hàng", about: "Câu Chuyện", contact: "Liên Hệ", logout: "Đăng Xuất", dashboard: "Quản Lý", welcome: "Chào,", login: "Đăng Nhập" }
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
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button 
              onClick={handleLanguageToggle}
              className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-all duration-300 flex items-center justify-center gap-1 text-sm font-medium h-10 px-3 rounded-full hover:bg-vintage-paper/50 dark:hover:bg-vintage-cream/10"
            >
              <Globe className={`w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isSwitching ? 'rotate-180' : ''}`} />
              
              {/* Sliding Text Container */}
              <div className="relative h-5 w-5 overflow-hidden">
                <div 
                  className={`flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    language === 'VI' ? '-translate-y-5' : 'translate-y-0'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center pt-0.5">EN</span>
                  <span className="flex h-5 w-5 items-center justify-center pt-0.5">VI</span>
                </div>
              </div>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-all duration-300 transform active:rotate-90 flex items-center justify-center h-10 w-10 rounded-full hover:bg-vintage-paper/50 dark:hover:bg-vintage-cream/10"
              aria-label="Toggle Dark Mode"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Search Toggle */}
            <div className="relative flex items-center">
                <button 
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300 flex items-center justify-center h-10 w-10 rounded-full hover:bg-vintage-paper/50 dark:hover:bg-vintage-cream/10 ${isSearchOpen ? 'text-vintage-gold' : ''}`}
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {/* Search Dropdown Input */}
                {isSearchOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-vintage-dark border border-vintage-border dark:border-vintage-border/20 shadow-lg rounded-md p-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <form onSubmit={handleSearchSubmit} className="flex items-center">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search..."
                                value={navSearchTerm}
                                onChange={(e) => setNavSearchTerm(e.target.value)}
                                className="w-full px-3 py-1.5 text-sm bg-transparent border-b border-vintage-gold focus:outline-none text-vintage-dark dark:text-vintage-cream placeholder-gray-400"
                            />
                            <button type="submit" className="ml-2 text-vintage-gold hover:text-vintage-gold-hover">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
            
            <Link 
                href="/cart" 
                className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300 relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-vintage-paper/50 dark:hover:bg-vintage-cream/10"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-vintage-rose text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-vintage-dark">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Icon / Dropdown */}
            <div 
                className="relative flex items-center" 
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
                ref={userMenuRef}
            >
              {username ? (
                 <div className="flex items-center justify-center cursor-pointer text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300 h-10 w-10 rounded-full hover:bg-vintage-paper/50 dark:hover:bg-vintage-cream/10">
                   <User className="w-5 h-5" />
                 </div>
              ) : (
                <Link href="/login" className="text-vintage-dark dark:text-vintage-paper hover:text-vintage-gold transition-colors duration-300 flex items-center gap-2 px-3 h-10 rounded-full hover:bg-vintage-paper/50 dark:hover:bg-vintage-cream/10">
                   <User className="w-5 h-5" />
                   <span className="text-sm font-medium hidden lg:inline">{t.login}</span>
                </Link>
              )}

              {/* Dropdown Menu */}
              {username && isUserMenuOpen && (
                  <div 
                    className="absolute right-0 top-full mt-0 w-48 bg-white dark:bg-vintage-dark border border-vintage-border dark:border-vintage-border/20 shadow-lg rounded-md overflow-hidden py-1 z-50 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
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
