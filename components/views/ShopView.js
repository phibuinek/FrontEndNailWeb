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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  // Sync URL params to state on change (including initial load)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');
    
    if (categoryParam) setSelectedCategory(categoryParam);
    if (sortParam) setSortBy(sortParam);
  }, [searchParams]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const uniqueCats = new Set();
    products.forEach(p => {
      const catName = typeof p.category === 'object' ? p.category[langKey] : p.category;
      uniqueCats.add(catName);
    });
    return Array.from(uniqueCats).sort();
  }, [products, langKey]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => {
        const catName = typeof p.category === 'object' ? p.category[langKey] : p.category;
        return catName === selectedCategory;
      });
    }

    // 2. Sort
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      // Change from priceDesc to Best Sellers (sold count) if using best-sellers link
      // But here we keep priceDesc as literal price high to low
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'bestSellers') {
      // New sort option for sold count
      result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    } else {
      // Default 'newest'
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedCategory, sortBy, langKey]);

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

  return (
    <main className="min-h-screen flex flex-col bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500">
      <Navbar />
      
      <div className="py-12 bg-vintage-paper dark:bg-vintage-dark/50 border-b border-vintage-border dark:border-vintage-border/10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-vintage-dark dark:text-vintage-gold transition-colors duration-500">{t.title}</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-500">
            {t.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Filters and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-vintage-dark/40 p-4 rounded-lg border border-vintage-border dark:border-vintage-border/20 shadow-sm">
            
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
                        <option key={cat} value={cat} className="bg-white dark:bg-vintage-dark">{cat}</option>
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
                        router.push('/shop');
                    }} className="mt-2 text-sm text-vintage-gold hover:underline">Clear Filters</button>
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
