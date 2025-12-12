'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsRequest } from '@/store/slices/productsSlice';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, ChevronRight, Filter, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const translations = {
  EN: {
    title: "Shop All Products",
    description: "Explore our complete collection of vintage-inspired nail supplies.",
    filterTitle: "Filter by Category",
    sortTitle: "Sort by",
    sortNewest: "Newest",
    sortPriceLow: "Price: Low to High",
    sortPriceHigh: "Price: High to Low",
    sortBestSellers: "Best Sellers",
    prev: "Previous",
    next: "Next",
    page: "Page",
    allCategories: "All Categories",
    showing: "Showing",
    to: "to",
    of: "of",
    products: "products"
  },
  VI: {
    title: "Tất Cả Sản Phẩm",
    description: "Khám phá bộ sưu tập đầy đủ các dụng cụ làm móng phong cách vintage của chúng tôi.",
    filterTitle: "Lọc theo Danh mục",
    sortTitle: "Sắp xếp theo",
    sortNewest: "Mới nhất",
    sortPriceLow: "Giá: Thấp đến Cao",
    sortPriceHigh: "Giá: Cao đến Thấp",
    sortBestSellers: "Bán Chạy Nhất",
    prev: "Trước",
    next: "Sau",
    page: "Trang",
    allCategories: "Tất Cả Danh Mục",
    showing: "Hiển thị",
    to: "đến",
    of: "trong tổng số",
    products: "sản phẩm"
  }
};

const ITEMS_PER_PAGE = 20;

export default function ShopView() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  // Ensure products is always an array to prevent runtime errors
  const products = Array.isArray(items) ? items : [];
  
  const { language } = useLanguage();
  const langKey = language.toLowerCase();
  const t = translations[language];
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  // Initialize state from URL params or defaults
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  // Sync URL params to state on change (including initial load)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) setSelectedCategory(categoryParam);
    if (sortParam) setSortBy(sortParam);
    if (searchParam) setSearchQuery(searchParam);
    else setSearchQuery(''); // Reset search if param removed
  }, [searchParams]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const uniqueCats = new Map(); // Use Map to store unique English keys and their display labels
    products.forEach(p => {
      // Get English name as the unique key (fallback to string if not object)
      const key = typeof p.category === 'object' ? p.category['en'] : p.category;
      // Get Display name based on current language
      const label = typeof p.category === 'object' ? p.category[langKey] : p.category;
      
      if (key && !uniqueCats.has(key)) {
          uniqueCats.set(key, label);
      }
    });
    // Convert Map to array of objects and sort by label
    return Array.from(uniqueCats.entries())
        .map(([key, label]) => ({ key, label }))
        .sort((a, b) => a.label.localeCompare(b.label));
  }, [products, langKey]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 0. Filter by Search Query
    if (searchQuery) {
        const term = searchQuery.toLowerCase();
        result = result.filter(p => {
            const nameEn = p.name?.en?.toLowerCase() || (typeof p.name === 'string' ? p.name.toLowerCase() : '');
            const nameVi = p.name?.vi?.toLowerCase() || '';
            return nameEn.includes(term) || nameVi.includes(term);
        });
    }

    // 1. Filter by Category (Compare with English key)
    if (selectedCategory !== 'All') {
      result = result.filter(p => {
        const catKey = typeof p.category === 'object' ? p.category['en'] : p.category;
        return catKey === selectedCategory;
      });
    }

    // 2. Sort
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'bestSellers') {
      result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedCategory, sortBy, searchQuery]); // Remove langKey from dependency as filtering logic is lang-agnostic now

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalProducts = filteredProducts.length;
  const startProduct = totalProducts > 0 ? startIndex + 1 : 0;
  const endProduct = Math.min(startIndex + ITEMS_PER_PAGE, totalProducts);

  const updateUrl = (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      params.set('page', '1'); // Reset to page 1 on filter/sort change
      router.push(`/shop?${params.toString()}`);
  };

  const handleCategoryChange = (e) => {
      const newCategory = e.target.value;
      setSelectedCategory(newCategory);
      updateUrl('category', newCategory);
  };

  const handleSortChange = (e) => {
      const newSort = e.target.value;
      setSortBy(newSort);
      updateUrl('sort', newSort);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage);
      router.push(`/shop?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500" />;
  }

  const highlightStats = [
    { label: language === 'VI' ? 'Bộ sưu tập' : 'Curated Sets', value: '120+', detail: language === 'VI' ? 'Sản phẩm thủ công' : 'Hand-picked products' },
    { label: language === 'VI' ? 'Khách hàng' : 'Clients', value: '4.8★', detail: language === 'VI' ? 'Đánh giá trung bình' : 'Average rating' },
    { label: language === 'VI' ? 'Phong cách' : 'Heritage', value: 'Vintage', detail: language === 'VI' ? 'Từ 1998' : 'Since 1998' },
  ];

  const curatedCollections = [
    { key: 'Gel Polish', label: language === 'VI' ? 'Bộ sơn gel cổ điển' : 'Classic Gel Sets', color: 'from-[#f7d8c6] to-[#f3b8a1]' },
    { key: 'Tools & Accessories', label: language === 'VI' ? 'Dụng cụ thủ công' : 'Artisan Tools', color: 'from-[#f0e4cf] to-[#d4c3aa]' },
    { key: 'Treatments', label: language === 'VI' ? 'Liệu trình spa' : 'Spa Treatments', color: 'from-[#f8e7dc] to-[#f1cab4]' },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fef6ed] via-[#fbe7d3] to-transparent dark:from-[#2b1f1a] dark:via-[#3a2b24] opacity-90 pointer-events-none" />
        <div className="relative py-8 sm:py-12 md:py-16 border-b border-vintage-border/30 dark:border-vintage-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
              <div className="space-y-4 sm:space-y-6">
                <p className="uppercase tracking-[0.4em] sm:tracking-[0.6em] text-[10px] sm:text-[11px] text-vintage-gold/80 dark:text-vintage-gold/80 font-medium">Curated atelier</p>
                <h1 className="relative text-2xl sm:text-[2.4rem] md:text-[3.2rem] lg:text-[3.7rem] font-serif text-vintage-dark dark:text-vintage-cream leading-tight tracking-tight">
                  <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/70 dark:bg-black/30 text-[0.75rem] sm:text-[0.9rem] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gray-500 mb-3 sm:mb-4 border border-vintage-border/50 dark:border-white/10 rounded-full">
                    {language === 'VI' ? 'Tuyển chọn thủ công' : 'Curated selection'}
                  </span>
                  <span className="block font-light">{searchQuery ? `"${searchQuery}"` : 'Vintage Atelier'}</span>
                  <span className="text-vintage-gold block font-normal text-xl sm:text-[2.2rem] md:text-[2.6rem] leading-tight mt-2 italic">
                    {language === 'VI' ? 'Bộ sưu tập thủ công' : 'Handcrafted collections'}
                  </span>
                  <span className="absolute -left-4 sm:-left-6 top-4 sm:top-6 w-12 h-12 sm:w-16 sm:h-16 border border-vintage-gold/60 rounded-full opacity-30 pointer-events-none" />
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl font-light leading-relaxed bg-white/60 dark:bg-black/20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-vintage-border/30 dark:border-white/10">
                  {t.description} {language === 'VI' ? 'Mỗi món mang dấu ấn cổ điển và sự tinh xảo của nghệ nhân.' : 'Each piece carries a nostalgic charm and artisan craftsmanship.'}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {highlightStats.map((stat) => (
                    <div key={stat.label} className="flex flex-col bg-white/80 dark:bg-vintage-dark/50 border border-vintage-border/40 dark:border-vintage-border/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[100px] sm:min-w-[130px] shadow-sm">
                      <span className="text-xl sm:text-2xl font-serif text-vintage-gold">{stat.value}</span>
                      <span className="text-xs sm:text-sm font-medium text-vintage-dark dark:text-vintage-cream">{stat.label}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{stat.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mt-6 md:mt-0">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-[#f6d7c6] via-transparent to-transparent opacity-40 blur-3xl" />
                <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                  {curatedCollections.map((collection) => (
                    <button
                      key={collection.key}
                      onClick={() => {
                        setSelectedCategory(collection.key);
                        updateUrl('category', collection.key);
                      }}
                      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${collection.color} border border-white/70 shadow-lg text-left transition-transform hover:-translate-y-1`}
                    >
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gray-500 font-semibold">Edition</p>
                      <p className="text-sm sm:text-lg font-serif font-bold text-vintage-dark mt-1 sm:mt-0">{collection.label}</p>
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-vintage-dark/80 mt-2 font-medium">
                        {language === 'VI' ? 'Khám phá' : 'Explore'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Filters and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white dark:bg-vintage-dark/40 p-3 sm:p-4 rounded-lg border border-vintage-border dark:border-vintage-border/20 shadow-sm">
            
            {/* Search Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto flex-grow md:mr-4 order-1">
                <div className="relative w-full">
                    <input 
                        type="text" 
                        placeholder={language === 'VI' ? "Tìm kiếm sản phẩm..." : "Search products..."}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                updateUrl('search', searchQuery);
                            }
                        }}
                        onBlur={() => updateUrl('search', searchQuery)}
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-transparent border-b border-vintage-border focus:border-vintage-gold outline-none text-vintage-dark dark:text-vintage-cream transition-colors"
                    />
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-vintage-gold">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto order-2 md:order-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-vintage-gold flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-vintage-dark dark:text-vintage-cream whitespace-nowrap">{t.filterTitle}:</span>
                <select 
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="bg-transparent border-b border-vintage-border focus:border-vintage-gold outline-none text-vintage-dark dark:text-vintage-cream text-xs sm:text-sm py-1 px-2 w-full md:w-48 transition-colors cursor-pointer"
                >
                    <option value="All" className="bg-white dark:bg-vintage-dark">{t.allCategories}</option>
                    {categories.map(cat => (
                        <option key={cat.key} value={cat.key} className="bg-white dark:bg-vintage-dark">{cat.label}</option>
                    ))}
                </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto order-3 md:order-3">
                <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-vintage-gold flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-vintage-dark dark:text-vintage-cream whitespace-nowrap">{t.sortTitle}:</span>
                <select 
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-transparent border-b border-vintage-border focus:border-vintage-gold outline-none text-vintage-dark dark:text-vintage-cream text-xs sm:text-sm py-1 px-2 w-full md:w-48 transition-colors cursor-pointer"
                >
                    <option value="newest" className="bg-white dark:bg-vintage-dark">{t.sortNewest}</option>
                    <option value="bestSellers" className="bg-white dark:bg-vintage-dark">{t.sortBestSellers}</option>
                    <option value="priceAsc" className="bg-white dark:bg-vintage-dark">{t.sortPriceLow}</option>
                    <option value="priceDesc" className="bg-white dark:bg-vintage-dark">{t.sortPriceHigh}</option>
                </select>
            </div>
        </div>

        {/* Product Grid */}
        <div className="min-h-[400px]">
            {loading && products.length === 0 ? (
                 <div className="flex justify-center items-center h-64">Loading...</div>
            ) : displayedProducts.length > 0 ? (
                 <ProductGrid products={displayedProducts} title="" />
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-vintage-dark dark:text-vintage-cream opacity-70">
                    <p className="text-lg font-serif">No products found.</p>
                    <button onClick={() => {
                        setSelectedCategory('All'); 
                        setSortBy('newest');
                        setSearchQuery('');
                        router.push('/shop');
                    }} className="mt-2 text-sm text-vintage-gold hover:underline">Clear Filters & Search</button>
                </div>
            )}
        </div>
        
        {/* Pagination Info & Controls */}
        {totalProducts > 0 && (
          <div className="mt-12 pb-16">
            {/* Product Count Info */}
            <div className="text-center mb-4 text-sm text-gray-600 dark:text-gray-400">
              {t.showing} <span className="font-semibold text-vintage-dark dark:text-vintage-cream">{startProduct}</span> {t.to} <span className="font-semibold text-vintage-dark dark:text-vintage-cream">{endProduct}</span> {t.of} <span className="font-semibold text-vintage-dark dark:text-vintage-cream">{totalProducts}</span> {t.products}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-vintage-dark dark:disabled:hover:text-vintage-cream transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.prev}</span>
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Always show first page */}
              {currentPage > 3 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 sm:px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold transition-all duration-300 text-sm sm:text-base cursor-pointer"
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="px-2 text-vintage-dark dark:text-vintage-cream">...</span>}
                </>
              )}

              {/* Show pages around current page */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Exclude pages already shown in "Always show first/last page"
                  const showFirstPage = currentPage > 3 && totalPages > 5;
                  const showLastPage = currentPage < totalPages - 2 && totalPages > 5;
                  
                  if (showFirstPage && page === 1) return false; // Exclude first page if already shown
                  if (showLastPage && page === totalPages) return false; // Exclude last page if already shown
                  
                  if (totalPages <= 7) return true; // Show all if 7 or fewer pages
                  if (currentPage <= 3) return page <= 5; // Show first 5 if near start
                  if (currentPage >= totalPages - 2) return page >= totalPages - 4; // Show last 5 if near end
                  return Math.abs(page - currentPage) <= 2; // Show 2 pages on each side
                })
                .map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 sm:px-4 py-2 border rounded-sm transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                      page === currentPage
                        ? 'bg-vintage-gold text-white border-vintage-gold font-semibold'
                        : 'border-vintage-border text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold'
                    }`}
                  >
                    {page}
                  </button>
                ))}

              {/* Always show last page */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 text-vintage-dark dark:text-vintage-cream">...</span>}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 sm:px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold transition-all duration-300 text-sm sm:text-base cursor-pointer"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-vintage-dark dark:disabled:hover:text-vintage-cream transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              <span className="hidden sm:inline">{t.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
