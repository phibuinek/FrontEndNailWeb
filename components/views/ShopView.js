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
    allCategories: "All Categories"
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
    allCategories: "Tất Cả Danh Mục"
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
        <div className="relative py-16 border-b border-vintage-border/30 dark:border-vintage-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <p className="uppercase tracking-[0.6em] text-[11px] text-vintage-gold/80 dark:text-vintage-gold/80 font-medium">Curated atelier</p>
                <h1 className="relative text-[2.4rem] md:text-[3.2rem] lg:text-[3.7rem] font-serif text-vintage-dark dark:text-vintage-cream leading-tight tracking-tight">
                  <span className="inline-block px-4 py-2 bg-white/70 dark:bg-black/30 text-[0.9rem] uppercase tracking-[0.5em] text-gray-500 mb-4 border border-vintage-border/50 dark:border-white/10 rounded-full">
                    {language === 'VI' ? 'Tuyển chọn thủ công' : 'Curated selection'}
                  </span>
                  <span className="block font-light">{searchQuery ? `“${searchQuery}”` : 'Vintage Atelier'}</span>
                  <span className="text-vintage-gold block font-normal text-[2.2rem] md:text-[2.6rem] leading-tight mt-2 italic">
                    {language === 'VI' ? 'Bộ sưu tập thủ công' : 'Handcrafted collections'}
                  </span>
                  <span className="absolute -left-6 top-6 w-16 h-16 border border-vintage-gold/60 rounded-full opacity-30 pointer-events-none" />
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl font-light leading-relaxed bg-white/60 dark:bg-black/20 px-4 py-3 rounded-xl border border-vintage-border/30 dark:border-white/10">
                  {t.description} {language === 'VI' ? 'Mỗi món mang dấu ấn cổ điển và sự tinh xảo của nghệ nhân.' : 'Each piece carries a nostalgic charm and artisan craftsmanship.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  {highlightStats.map((stat) => (
                    <div key={stat.label} className="flex flex-col bg-white/80 dark:bg-vintage-dark/50 border border-vintage-border/40 dark:border-vintage-border/20 rounded-lg px-4 py-3 min-w-[130px] shadow-sm">
                      <span className="text-2xl font-serif text-vintage-gold">{stat.value}</span>
                      <span className="text-sm font-medium text-vintage-dark dark:text-vintage-cream">{stat.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{stat.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#f6d7c6] via-transparent to-transparent opacity-40 blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  {curatedCollections.map((collection) => (
                    <button
                      key={collection.key}
                      onClick={() => {
                        setSelectedCategory(collection.key);
                        updateUrl('category', collection.key);
                      }}
                      className={`p-4 rounded-2xl bg-gradient-to-br ${collection.color} border border-white/70 shadow-lg text-left transition-transform hover:-translate-y-1`}
                    >
                      <p className="text-xs uppercase tracking-[0.5em] text-gray-500 font-semibold">Edition</p>
                      <p className="text-lg font-serif font-bold text-vintage-dark">{collection.label}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-vintage-dark/80 mt-2 font-medium">
                        {language === 'VI' ? 'Khám phá' : 'Explore'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Filters and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-vintage-dark/40 p-4 rounded-lg border border-vintage-border dark:border-vintage-border/20 shadow-sm">
            
            {/* Search Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto flex-grow md:mr-4">
                <div className="relative w-full">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            // Optional: Debounce URL update or update on enter
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                updateUrl('search', searchQuery);
                            }
                        }}
                        onBlur={() => updateUrl('search', searchQuery)} // Update URL on blur to sync
                        className="w-full pl-10 pr-4 py-1.5 text-sm bg-transparent border-b border-vintage-border focus:border-vintage-gold outline-none text-vintage-dark dark:text-vintage-cream transition-colors"
                    />
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-vintage-gold">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-5 h-5 text-vintage-gold" />
                <span className="text-sm font-medium text-vintage-dark dark:text-vintage-cream whitespace-nowrap">{t.filterTitle}:</span>
                <select 
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="bg-transparent border-b border-vintage-border focus:border-vintage-gold outline-none text-vintage-dark dark:text-vintage-cream text-sm py-1 px-2 w-full md:w-48 transition-colors cursor-pointer"
                >
                    <option value="All" className="bg-white dark:bg-vintage-dark">{t.allCategories}</option>
                    {categories.map(cat => (
                        <option key={cat.key} value={cat.key} className="bg-white dark:bg-vintage-dark">{cat.label}</option>
                    ))}
                </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <ArrowUpDown className="w-4 h-4 text-vintage-gold" />
                <span className="text-sm font-medium text-vintage-dark dark:text-vintage-cream whitespace-nowrap">{t.sortTitle}:</span>
                <select 
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-transparent border-b border-vintage-border focus:border-vintage-gold outline-none text-vintage-dark dark:text-vintage-cream text-sm py-1 px-2 w-full md:w-48 transition-colors cursor-pointer"
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
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4 pb-16">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-vintage-dark dark:disabled:hover:text-vintage-cream transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.prev}
            </button>
            
            <span className="text-vintage-dark dark:text-vintage-gold font-medium">
              {t.page} {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-vintage-border rounded-sm text-vintage-dark dark:text-vintage-cream hover:bg-vintage-gold hover:text-white hover:border-vintage-gold disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-vintage-dark dark:disabled:hover:text-vintage-cream transition-all duration-300"
            >
              {t.next}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
